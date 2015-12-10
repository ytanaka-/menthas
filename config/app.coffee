#
# express/httpの設定
#

path = require 'path'
config = require 'config'

# Module Dependencies
require.all  = require 'direquire'
express      = require "express"
mongoose     = require "mongoose"
bodyParser   = require 'body-parser'
cookieParser = require 'cookie-parser'
favicon      = require 'serve-favicon'

app = express()

app.set 'port', process.env.PORT || 4000

# models/events
app.set 'models', require.all path.resolve 'models'
app.set 'events', require.all path.resolve 'events'

# views
app.set "views", path.resolve "views"
app.set "view engine", "jade"
app.disable 'x-powered-by'

# middlewares
app.use bodyParser.json()
app.use bodyParser.urlencoded({ extended: false })
app.use cookieParser()

# set static files
app.use express.static(path.resolve "public")

app.use favicon(__dirname + '/../public/images/favicon.ico')

# Routes
(require path.resolve 'routes','main') app

# connect mongodb
url = config.get "mongodb.url"
mongoose.connect url

exports = module.exports = app