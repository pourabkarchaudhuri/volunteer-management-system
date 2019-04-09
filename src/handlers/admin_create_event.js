var multer = require('multer');
const { connection } = require('./event_db')

class Crud {

    uploadimage(image) {
        var Storage = multer.diskStorage({
            destination: function (req, file, callback) {
                callback(null, "./Images");
            },
            filename: function (req, file, callback) {
                callback(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
            }
        });
        var upload = multer({ storage: Storage }).array("image", 3);
        upload(function (err) {
            if (err) {
                console.log("Something went wrong!");
            }
            console.log("File uploaded sucessfully!.");
        });
    }

    add(name,activity,work,location,image){
        console.log("*****************inside function************")
        console.log(name)
        console.log(activity)
        console.log(work)
        console.log(location)
        connection.connect(function(err) {
            if(err){
                    console.log("error while connecting",err)
            } else {
                connection.query("INSERT INTO event values('" + name + "','" + activity + "','" + work + "','" + location + "','" + image + "')", function (err, resp) {
                    console.log("*********inside query function")
                    if (err) {
                        console.log("error while querying",err);
                    } else {
                    console.log("***************** successful *************")
                    }
                });
            }
            //connection.close();
        });
    }

    delete(name) {
        console.log("name of event", name)
        connection.connect(function(err) {
            if(err){
                console.log("error while connecting",err)
            } else {
                connection.query("delecte from event where 'name' = '"+name+"' ",function(err, resp) {
                    if(err) {
                        console.log("error while querying",err)
                    }else {
                        console.log("****successfully deleted***")
                    }
                });
            }
        });
    }
}

module.exports = Crud



