/// <reference path="/Scripts/Custom/Core.js" />

//Current state of chart type checkbox
var checkBoxValues = {
    "Supply": false,
    "Demand": false,
    "Reservoirs": false,
    "Sustainability": false,
    "All": false
};

//Loop through all checkboxes and setup on click to enable or disable the chart type
$(":checkbox").click(function () {
    checkBoxValues[this.name] = !checkBoxValues[this.name];
    if (this.name == "All") {
        var value = checkBoxValues["All"];
        for (var i in checkBoxValues) {
            checkBoxValues[i] = value;
            $('#checkbox' + i).prop('checked', value);
        }
    }
});

//Setup dialog to select type of charts to be created
$(function () {
    $("#dialog-charts").dialog({
        autoOpen:false,
        resizable: false,
        height: 300,
        width: 300,
        modal: true,
        buttons: {
            "Done": {
                click: function () {
                    if (checkBoxValues["Supply"])
                        addSupply();
                    if (checkBoxValues["Demand"])
                        addDemand();
                    if (checkBoxValues["Reservoirs"])
                        addResevoirs();
                    if (checkBoxValues["Sustainability"])
                        addSustainability();

                    loadCharts();

                    $(this).dialog("close");
                },
                'class': 'button',
                text: 'Done'
            }
        }
    });
});

//Source: http://stackoverflow.com/questions/19491336/get-url-parameter-jquery
//Get URL parameter 'name'
$.urlParam = function (name) {
    var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
    if (results == null) {
        return null;
    }
    else {
        return results[1] || 0;
    }
}
//********************************************************
// Begin Communication Code
//********************************************************

//Standard Communication Strings
var dataRequestString = 'requesting data';
var dataSentString = 'Sending requested data';
var callWebServSuccessString = 'callWebService Success';
var callWebServFailString = 'callWebService Failure';
var temporalRadioChangeString = 'temporal radio change';
var geographyRadioChangeString = 'geography radio change';
var loadingString = 'loading';

//Communication data container
var Com = {
    connection: false,
    windowType: 'Charts',
    masterWindow: '',
    masterWindowPath: '',
    id: -1
}
//Adds window event handler to recieve messages from other windows
//Once the connection is established it'll remove the loading screen
//and display the menu to select charts.
function communication() {
    window.addEventListener('message', function (event) {
        //console.log("receive something ", event);
        try {
            var data = JSON.parse(event.data);

            if (data.message === "FirstConnection") {
                Com.connection = true;
                Com.masterWindow = event.source;
                Com.masterWindowPath = event.origin;
                Com.id = data.id;

                data.message = "FirstConnectionReceive";
                Com.masterWindow.postMessage(JSON.stringify(data), event.origin);
                //console.log("Charts is ready to communicate.");
                $("#WSLoading").hide();
                $("#dialog-charts").dialog("open");
            }
            else if (Com.connection) {
                //Connection has been established process message
                //console.log(data.message);
                //If message has a windowType check for a message
                if (data.hasOwnProperty('source')) {
                    if (data.message == dataSentString) {
                        recieveRequestedData(data);
                    }
                    else if (data.message == temporalRadioChangeString) {
                        recieveTemporalRadioChange(data);
                    }
                    else if (data.message == geographyRadioChangeString) {
                        recieveGeographyRadioChange(data);
                    }
                    else if (data.message == callWebServSuccessString) {
                        recieveWebServSuccess(data);
                    }
                    else if (data.message == loadingString) {
                        recieveLoading();
                    }
                }
            }
        } catch (e) {
            console.log('invalid json', data);
        }
        //console.log(event);
    });
}
//Requests webService data from Default.aspx
function callWebServiceCharts(testData) {
    if (Com.connection) {
        var data = {
            source: Com.windowType,
            id: Com.id,
            message: dataRequestString
        }

        Com.masterWindow.postMessage(JSON.stringify(data), Com.masterWindowPath);
    }
}
//Updating the strtYr and endYr to match Default.aspx
function updateStrtYrEndYr(data) {
    strtYr = parseInt(data.strtYr);
    endYr = parseInt(data.endYr);
    //console.log("strtYr & endYr: "+strtYr+", "+endYr);
}
//Recieved initial data to setup page (strYr,endYr,provider,webserviceData)
function recieveRequestedData(data) {
    infoRequestJSON = data.infoRequestJSON;

    //Updating the strtYr and endYr to match Default.aspx
    updateStrtYrEndYr(data);

    //looping through the output controls to set the provider
    if ((typeof (data.provider) != "undefined")) {
        $('.OutputControl').each(function () {

            var controlID = $(this).attr('id');
            var type = $("#" + controlID).attr("data-Type");

            if (type == "MFOP") {
                $("#" + controlID).find("select[id*=ddlfld]").val(data.provider);
            }
        });
    }

    drawOutputCharts(data.testData);
}
//Temporal Radio Changed update charts
function recieveTemporalRadioChange(data) {
    updateStrtYrEndYr(data);

    //looping through the output controls to populate the charts
    $('.OutputControl').each(function () {
        var controlID = $(this).attr('id');
        drawChart(controlID);
    });
}
//Geography Radio Changed update charts
function recieveGeographyRadioChange(data) {
    //looping through the output controls to set the provider and populate the charts
    $('.OutputControl').each(function () {

        var controlID = $(this).attr('id');
        var type = $("#" + controlID).attr("data-Type");

        if (type == "MFOP") {
            $("#" + controlID).find("select[id*=ddlfld]").val(data.provider);
            drawChart(controlID);
        }
    });
}
//Model Successful ran and returned new data
function recieveWebServSuccess(data) {
    //$("#WSLoading").hide();
    drawOutputCharts(data.testData);
}
//Model is about to run show loading screen
function recieveLoading() {
    //$("#WSLoading").show();
}
//Enable Communication
communication();