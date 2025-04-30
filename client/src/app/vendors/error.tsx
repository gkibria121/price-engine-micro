"use client";
import React from "react";
import PageError from "../../componets/PageError";
function Error({ error }) {
  console.error(error);
  return <PageError>Unable to load vendors.</PageError>;
}

export default Error;
