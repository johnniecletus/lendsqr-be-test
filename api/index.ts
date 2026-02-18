import app from "../dist/app";
import { db } from "../dist/db/knex";

let ready = false;

export default async function handler(req: any, res: any) {
  if (!ready) {
    
    ready = true;
  }

  return app(req, res);
}
