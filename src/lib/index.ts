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
  // https://vercel.com/docs/projects/environment-variables/system-environment-variables
  return !!process.env.VERCEL_PROJECT_PRODUCTION_URL;
}

export const getBaseURL = () => {
  const inProd = isDeployedProduction();
  return inProd
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000";
};