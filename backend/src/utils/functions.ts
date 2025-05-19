import { Document, Model, Schema, PopulateOptions } from "mongoose";

export async function populateAllRefsMany<T extends Document>(
  docs: T[],
  modelSchema: Schema
): Promise<T[]> {
  const refs: string[] = [];

  for (const path in modelSchema.paths) {
    const schemaType: any = modelSchema.paths[path];

    if (schemaType.options?.ref) {
      refs.push(path);
    }

    if (
      schemaType instanceof Schema.Types.Array &&
      schemaType.caster?.options?.ref
    ) {
      refs.push(path);
    }
  }

  return Promise.all(
    docs.map(
      (doc) => doc.populate(refs).then((temp) => temp.toJSON()) as Promise<T>
    )
  );
}
