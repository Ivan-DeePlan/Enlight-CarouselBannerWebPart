import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/batching";
import "@pnp/sp/files";
import "@pnp/sp/folders";

import { WebPartContext } from "@microsoft/sp-webpart-base";
import { spfi, SPFI, SPFx } from "@pnp/sp";

var _sp: SPFI = null;

const getSP = (context?: WebPartContext): SPFI => {
  _sp = spfi().using(SPFx(context));
  return _sp;
};

export default getSP;
