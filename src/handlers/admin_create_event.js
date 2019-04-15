const { connection } = require('./vml_db')

class Crud {

    add_event_by_admin(event_name,activity,work,location,hexa_association,pre_vol_activities,testimonials,links,callback){
        console.log("****inside add function****")
        console.log("event_name :",event_name)
        console.log("Activity :",activity)
        console.log("Work :",work)
        console.log("Location",location)
        connection.connect().then(function () {
            connection.query("INSERT INTO event values('" + event_name + "','" + activity + "','" + work + "','" + location + "','" + hexa_association + "','" + pre_vol_activities + "','" + testimonials + "','" + links + "')").then(function (recordSet) {
                console.log("****inserted successfully****")
                callback(null,recordSet)
                connection.close();
            }).catch(function (err) {
                console.log("error while querying",err);
                connection.close();
                callback(err, null)
            });
        }).catch(function (err) {
            console.log("error while connection to db",err);
            callback(err,null)
        });
    }

    delete_event_by_admin(event_name, callback) {
        console.log("name of event", event_name)
        connection.connect().then(function () {
            connection.query("delete from event where event_name = '"+event_name+"'").then(function (recordSet) {
                console.log("****successfully deleted****")
                connection.close();
                callback(null,recordSet)
            }).catch(function (err) {
                console.log("error while querying",err);
                connection.close();
                callback(err,null)
            });
        }).catch(function (err) {
            console.log("error while connection to db",err);
            callback(err,null)
        });
    }

    update_event_by_admin(event_name,activity,work,location,hexa_association,pre_vol_activities,testimonials,links,callback) {
        connection.connect().then(function() {
            connection.query("update event set activity = '"+activity+"',set work = '"+work+"',set location = '"+location+"',set hexa_association = '"+hexa_association+"',set pre_vol_activities = '"+pre_vol_activities+"',set testimonials = '"+testimonials+"',set links = '"+links+"' where event_name = '"+event_name+"' ").then(function (recordSet) {
                console.log("****Updated Successfully****")
                connection.close();
                callback(null,recordSet)
            }).catch(function (err) {
                console.log("error while querying",err);
                connection.close();
                callback(err,null)
            });
        }).catch(function (err) {
            console.log("error while connection to db",err);
            callback(err,null)
        });
    }

    attended_list(emp_name, event_name, email, callback)
    {
        connection.connect().then(function() {
            connection.query("insert into attendance values('"+ emp_name +"', '"+ event_name +"', '"+ email +"')").then(function (recordSet) {
                console.log("****Updated Successfully****")
                connection.close();
                callback(null,recordSet)
            }).catch(function (err) {
                console.log("error while querying",err);
                connection.close();
                callback(err,null)
            });
        }).catch(function (err) {
            console.log("error while connection to db",err);
            callback(err,null)
        });
    }
}
module.exports = Crud




