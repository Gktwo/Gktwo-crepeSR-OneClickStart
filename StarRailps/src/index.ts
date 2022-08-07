/**
 * @package CrepeSR
 * @author Crepe-Inc
 * @license AGPL-3.0
 */
import Interface from "./commands/Interface";
import HttpServer from "./http/HttpServer";
import SRServer from "./server/kcp/SRServer";
import Banners from "./util/Banner";
import Logger from "./util/Logger";
import ProtoFactory from "./util/ProtoFactory"

const c = new Logger("CrepeSR");
c.log(`本服务端程序开源免费，如果你是付费获得，请及时退款差评并且举报`);
c.log(`开源地址:https://github.com/Crepe-Inc/CrepeSR`);
c.log(`正在启动 CrepeSR...`);

Banners.init();
ProtoFactory.init();
Interface.start(); 
HttpServer.getInstance().start();
SRServer.getInstance().start();