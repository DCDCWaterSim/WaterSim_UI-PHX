// -------------------------------------------------------
// Pull in State Level Data of input controls and
// indicator selections from Scripts/Ipad/STC.js
// 03.08.16 DAS
// =============
var CT = STC;
// 03.18.16 DAS
// Groundwater, Economy, environemt, Power, Agriculture, surface water, and Urban efficiencies
// Three places these MUST be defined; 1) Here, 2_ Indicator.js (~line 39), and Below
// For five indicators: var height = 220;var width = 235;
//var height = 230;
var height = 220;
var width = 235;
// For six indicators
var indicatorParameters = {

    "GWSYA": {
        divId: "idGWSYADiv", anIndicatorType: "GWSYA", ControlId: "idGWSYAIndicator", options: { Height: height, Width: width }
    },
    "ECOR": {
        divId: "idECORDiv", anIndicatorType: "ECOR", ControlId: "idECORIndicator", options: { Height: height, Width: width }
    },
    "ENVIND": {
        divId: "idENVINDDiv", anIndicatorType: "ENVIND", ControlId: "idENVINDIndicator", options: { Height: height, Width: width }
    },
    "PEF": {
        divId: "idPEFDiv", anIndicatorType: "PEF", ControlId: "idPEFIndicator", options: {
            Height: height,
            Width: width,
            meter: {
                style: 'rgr_meter'
            }
        }
    },
    "AGIND": {
        divId: "idAGINDDiv", anIndicatorType: "AGIND", ControlId: "idAGINDIndicator", options: {
            Height: height,
            Width: width,
            meter: {
                style: 'rgr_meter'
            }
        }
    },
    "SWI": {
        divId: "idSWIDiv", anIndicatorType: "SWI", ControlId: "idSWIIndicator", options: { Height: height, Width: width }
    },
    "UEF": {
        divId: "idUEFDiv", anIndicatorType: "UEF", ControlId: "idUEFIndicator",
        options: {
            Height: height,
            Width: width,
            meter: {
                style: 'rgr_meter'
            }
        }
    }
}

// -------------------------------------------------------
// 02.26.2016 DAS
// Grab the name of the state from the url (if not null)
var ourState = "Florida";
function getState() {
    //var temp = $.urlParam('state');
    //if (temp !== null) {
    //    ourState = $.urlParam('state');
    //}
    getStateInt(ourState);
    return ourState;
}
var States = ["Florida", "Idaho", "Illinois", "Minnesota", "Wyoming"];

var StateNames = ["Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Dist. of Columbia",
                                            "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky",
                                            "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri",
                                            "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico", "New York", "North Carolina",
                                            "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Puerto Rico", "Rhode Island", "South Carolina",
                                            "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"];

function getStateInt() {

    var cnt;
    var check;
    var stateInt = 0;
    for (var i = 0; i < States.length; i++) {
        check = States[i];

        if (check == ourState) {
            stateInt = i;
            break;
        }
    }
    return stateInt;
}
//
var IndicatorControlsArray = [];
function setStateInformation() {
    //var userState = $.urlParam('state');
    var userState = getState();

    if (userState != null) {
        //Perform state specific information here such as choosing which
        //input controls should be visible/available
        // Display the name of the State above the Policy DIV, i.e.,
        // <aside id="left-sidebar">
        //   <asp:Panel ID="PanelUserInputs" runat="server">
        $('#dashboard-header-h0').text(userState);
        //
        // found below: 03.02.2016 DAS

        // STEPTOE EDIT BEGIN 09/20/16
        //hideInputControls(userState);
        // STEPTOE EDIT END 09/20/16

        displayIndicators(userState);
        //
    }
    else {
        //var height = 230;
        //GWPIndicatorControl = new IndicatorControl("idGWPDiv", "ECOR", "idGWPIndicator", { Height: height });
        //ENVIndicatorControl = new IndicatorControl("idENVDiv", "environment", "idENVIndicator", {Height: height});
        //AGRIndicatorControl = new IndicatorControl("idAGRDiv", "SWI", "idAGRIndicator", { Height: height });
        //PWCIndicatorControl = new IndicatorControl("idPWCDiv", "groundwater", "idPWCIndicator", {Height: height});
        //AWSIndicatorControl = new IndicatorControl("idAWSDiv", "urbanefficiency", "idAWSIndicator",
        //    {
        //        Height: height,
        //        meter: {
        //            style: 'rgr_meter'
        //        }
        //    }
        //);
    }
}
//setStateInformation();

//hide all input controls
function hideInputControls(state) {
    $('.InputControl').hide()
    //show controls in array
    var stateString = String(state);
    for (var index = 0; index < CT[stateString].IFLDS.length; index++) {

        $('#' + CT[stateString].IFLDS[index] + 'InputUserControl_ControlContainer').show()
    }
}
// QUAY EDIT 4/12/16 BEGIN
// This will set the indicator Titles to the web label
function ResetIndicatorTitles() {
    var fieldInfo = INFO_REQUEST.FieldInfo;
    for (var i = 0; i < fieldInfo.length; i++) {
        if (fieldInfo[i].WEBL) {
            if (fieldInfo[i].WEBL != "") {
                switch (fieldInfo[i].FLD) {
                    case "ENVIND":
                        IndSetupData.ENVIND.title = fieldInfo[i].WEBL;
                        break;
                    case "SWI":
                        IndSetupData.SWI.title = fieldInfo[i].WEBL;
                        break;
                    case "UEF":
                        IndSetupData.UEF.title = fieldInfo[i].WEBL;
                        break;
                }
            }
        }
    }
    //            IndSetupData = {
    //        ECOR: {
    //        filenames:['./Assets/indicators/New_Images/economy_button_grey.jpg','./Assets/indicators/New_Images/economy_flat_grey.jpg','./Assets/indicators/New_Images/economy_flat_grey_color.jpg','./Assets/indicators/New_Images/economy.jpg'],
    //        title: 'Economy'
    //},
    //ENVIND: {
    //        filenames: ['./Assets/indicators/New_Images/environment_button_grey.jpg', './Assets/indicators/New_Images/environment_flat_grey.jpg', './Assets/indicators/New_Images/environment_flat_grey_color.jpg', './Assets/indicators/New_Images/environment.jpg'],
    //        title: 'Environment'
    //},
    //SWI: {
    //        filenames: ['./Assets/indicators/New_Images/surfacewater_button_grey.jpg', './Assets/indicators/New_Images/surfacewater_flat_grey.jpg', './Assets/indicators/New_Images/surfacewater_flat_grey_color.jpg', './Assets/indicators/New_Images/surfacewater.jpg'],
    //        title: 'Surface Water'
    //},
    //GWSYA: {
    //        filenames: ['./Assets/indicators/New_Images/groundwater_button_grey.jpg', './Assets/indicators/New_Images/groundwater_flat_grey.jpg', './Assets/indicators/New_Images/groundwater_flat_grey_color.jpg', './Assets/indicators/New_Images/groundwater.jpg'],
    //        title: 'Groundwater'
    //},
    //UEF: {
    //        filenames: ['./Assets/indicators/New_Images/urbanefficiency_button_grey.jpg', './Assets/indicators/New_Images/urbanefficiency_flat_grey.jpg', './Assets/indicators/New_Images/urbanefficiency_flat_grey_color.jpg', './Assets/indicators/New_Images/urbanefficiency.jpg'],
    //        title: 'Urban Efficiency'
    //},
    //PEF: {
    //        filenames: ['./Assets/indicators/New_Images/power_button_grey.jpg', './Assets/indicators/New_Images/power_flat_grey.jpg', './Assets/indicators/New_Images/power_flat_grey_color.jpg', './Assets/indicators/New_Images/power.jpg'],
    //        title: 'Power Efficiency'
    //},
    //AGIND: {
    //        filenames: ['./Assets/indicators/New_Images/agriculture_button_grey.jpg', './Assets/indicators/New_Images/agriculture_flat_grey.jpg', './Assets/indicators/New_Images/agriculture_flat_grey_color.jpg', './Assets/indicators/New_Images/agriculture.jpg'],
    //        title: 'Agriculture'
    //}, 

}
// QUAY EDIT 4/12/16 END

function displayIndicators(state) {
    var stateString = String(state);
    // QUAY EDIT 4/12/16 begin
    ResetIndicatorTitles();
    // QUAY EDIT 3/12/16 END
    // QUAY EDIT 3/19/16 begin
    //  need to clear array
    IndicatorControlsArray = new Array();
    // need to clear all old indicators, if there
    //$('.accordion').each(function () {
    //    if (this.innerHTML) {
    //        this.innerHTML = "";
    //    }
    //});
    // QUAY EDIT 3/19/16 begin
    for (var index = 0; index < CT[stateString].INDFLDS.length; index++) {
        var params = indicatorParameters[CT[stateString].INDFLDS[index]];

        // STEPTOE EDIT 5/13/16 BEGIN
        // IndicatorControlsArray[params.anIndicatorType] = new IndicatorControl(params.divId, params.anIndicatorType, params.ControlId, params.options)
        IndicatorControlsArray[params.anIndicatorType] = new IndicatorControlNew(params.divId, params.anIndicatorType, params.ControlId, params.options, index == (CT[stateString].INDFLDS.length - 1))
        // STEPTOE EDIT 5/13/16 END
        console.log('(CT[stateString].INDFLDS.length - 1): ', index == (CT[stateString].INDFLDS.length - 1));
    }

}
// New drawAllInndicators function for WaterSimAmerica
// 03.02.2016 DAS
function drawAllIndicatorsNew(jsondata) {
    console.log("drawAllIndicators");
    var stateString = getState();
    var indicatorDisplayed = CT[stateString].INDFLDS;

    var done = [];
    for (di = 0; di < indicatorDisplayed.length; di++) {
        done[CT[stateString].INDFLDS[di]] = 0;
    }
    $.each(jsondata.RESULTS, function () {
        var lastIndex = this.VALS.length - 1;
        if (this.FLD == "AGIND") {
            console.log("AGIND")
            if (done["AGIND"] == 0) {
                IndicatorControlsArray["AGIND"].SetValue(this.VALS[lastIndex]);
                done["AGIND"] = 1;
            }

        } else if (this.FLD == "ECOR") {
            console.log("ECOR")
            if (done["ECOR"] == 0) {
                IndicatorControlsArray["ECOR"].SetValue(this.VALS[lastIndex]);
                done["ECOR"] = 1;
            }

        } else if (this.FLD == "GWSYA") {
            console.log("GWSYA")
            if (done["GWSYA"] == 0) {
                IndicatorControlsArray["GWSYA"].SetValue(this.VALS[lastIndex]);
                done["GWSYA"] = 1;
            }

        } else if (this.FLD == "SWI") {
            console.log("SWI")
            if (done["SWI"] == 0) {
                IndicatorControlsArray["SWI"].SetValue(this.VALS[lastIndex]);
                done["SWI"] = 1;
            }
        }
        else if (this.FLD == "UEF") {
            console.log("UEF")
            if (done["UEF"] == 0) {
                IndicatorControlsArray["UEF"].SetValue(this.VALS[lastIndex]);
                done["UEF"] = 1;
            }
        }
        else if (this.FLD == "PEF") {
            console.log("PEF")
            if (done["PEF"] == 0) {
                IndicatorControlsArray["PEF"].SetValue(this.VALS[lastIndex]);
                done["PEF"] = 1;
            }
        }
        else if (this.FLD == "ENVIND") {
            console.log("ENVIND")
            if (done["ENVIND"] == 0) {
                IndicatorControlsArray["ENVIND"].SetValue(this.VALS[lastIndex]);
                done["ENVIND"] = 1;
            }
        }

    });

}