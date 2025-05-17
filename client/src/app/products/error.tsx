"use client";
import React from "react";
import PageError from "../../componets/PageError";
function Error({ error }) {
  return <PageError>{error.message ?? "Unable to load products"}</PageError>;
}

export default Error;
