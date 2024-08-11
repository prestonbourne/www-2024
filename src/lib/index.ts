import { PHASE_PRODUCTION_BUILD, PHASE_DEVELOPMENT_SERVER, PHASE_PRODUCTION_SERVER } from "next/dist/shared/lib/constants";


export const formatISOToDate = (ISO: string) => {
  return new Date(ISO).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export const onlyIn = (env: typeof process.env.NODE_ENV, fn: Function) => {
  if (process.env.NODE_ENV === env) {
    return fn();
  }
  return null;
};

export const isDeployedProduction = () => {
  return process.env.NEXT_PHASE === PHASE_PRODUCTION_SERVER;
};