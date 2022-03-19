export function envConfigBuild() {
  return {
    database: {
      host: process.env.DATABASE_HOST,
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      name: process.env.DATABASE_NAME,
    },
    auth: {
      region: process.env.COGNITO_REGION,
      poolId: process.env.COGNITO_USER_POOL_ID,
    },
  };
}
