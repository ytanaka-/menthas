#
# 起動スクリプト
#
http = require 'http'
path = require 'path'

app = require path.resolve('config','app')
#io = require path.resolve('config','io')

#start http server and socket.io
server = http.createServer app
#io app,server

server.listen app.get("port"), ->
  console.log "listening on *:#{app.get("port")}..."