let requestHandlers = require("./requestHandlers"),
server = require("./server"),
router = require("./router");

let handle = {};
handle["/"] = requestHandlers.start;
handle["/upload"] = requestHandlers.upload;

server.start(router.route, handle);
