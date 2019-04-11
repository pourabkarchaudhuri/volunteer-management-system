const { connection } = require('./vml_db')

class CrudUser {
    register_event(emp_name, emp_id, contact_no, email, event_name, event_time) {
        connection.connect().then(function () {
            connection.query("INSERT INTO register values('" + emp_name + "','" + emp_id + "','" + contact_no + "','" + contact_no + "','" + email + "','" + event_name + "','" + event_time + "')").then(function (recordSet) {
                console.log("****inserted successfully****")
                connection.close();
            }).catch(function (err) {
                console.log("error while querying",err);
                connection.close();
            });
        }).catch(function (err) {
            console.log("error while connection to db",err);
        });
    }

    del_registration_by_user(event_name) {
        connection.connect().then(function () {
            connection.query("delete from register where event_name = '"+ event_name +"'").then(function (recordSet) {
                console.log("****deleted the registration****")
                connection.close();
            }).catch(function (err) {
                console.log("error while querying",err);
                connection.close();
            });
        }).catch(function (err) {
            console.log("error while connection to db",err);
        });
    }

    editSlots_by_user(event_name, update_time){
        connection.connect().then(function () {
            connection.query("update event set event_time = '"+ update_time +"' where event_name = '"+ event_name +"' ").then(function (recordSet) {
                console.log("****updated the registration****")
                connection.close();
            }).catch(function (err) {
                console.log("error while querying",err);
                connection.close();
            });
        }).catch(function (err) {
            console.log("error while connection to db",err);
        });
    }

}
module.exports = CrudUser