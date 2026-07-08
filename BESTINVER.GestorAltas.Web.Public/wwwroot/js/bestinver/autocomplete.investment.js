function InitInvestmentAutocomplete(_ProductType) {
    var options_fondo = {
        url: function (phrase) {
            return apiConfig.API_Master_FundsData + "?letters=" + phrase + "&IdProductType=" + _ProductType;
        },

        getValue: "nombref",

        requestDelay: 500,

        list: {
            maxNumberOfElements: 12,
            onClickEvent: function () {
                $('#investment-content').block({ message: null }); 
                var val_fondo_code = $("#contracttype-externaltransfer-fundname").getSelectedItemData().codigo;
                var val_fondo = $("#contracttype-externaltransfer-fundname").getSelectedItemData().nombref;

                Request.GetFundData(val_fondo_code, _ProductType).then(function (result) {
                    var val_isin = result.IsinCode;
                    var val_manager = result.ManagementCompanyName;
                    var val_manager_code = result.ManagementCompanyCode === "0" ? "" : result.ManagementCompanyCode;

                    $("#contracttype-externaltransfer-fundname-previous").val(val_fondo).trigger("change");
                    $("#contracttype-externaltransfer-fundisin").val(val_isin).trigger("change");
                    $("#contracttype-externaltransfer-fundname").val(val_fondo).trigger("change");
                    $("#contracttype-externaltransfer-fundname-code").val(val_fondo_code).trigger("change");
                    $("#contracttype-externaltransfer-manager").val(val_manager).trigger("change");
                    $("#contracttype-externaltransfer-manager-code").val(val_manager_code).trigger("change");
                    $('#investment-content').unblock({ message: null }); 
                });
            }
        }
    };

    var options_plan = {
        url: function (phrase) {
            return apiConfig.API_Master_PlansData + "?letters=" + phrase + "&IdProductType=" + _ProductType;
        },

        getValue: "nombref",

        requestDelay: 500,

        list: {
            maxNumberOfElements: 12,

            onClickEvent: function () {
                var val_plan = $("#contracttype-externaltransfer-planname").getSelectedItemData().nombref;
                var val_plan_code = $("#contracttype-externaltransfer-planname").getSelectedItemData().codigo;

                $('#investment-content').block({ message: null }); 
                Request.GetFundData(val_plan_code, _ProductType).then(function (result) {

                    var val_gestora_code = result.ManagementCompanyCode;
                    var val_fondo_code = result.PlanFundId;
                    var val_fondo_name = result.PlanFund;

                    $("#contracttype-externaltransfer-planname-previous").val(val_plan).trigger("change");
                    $("#contracttype-externaltransfer-planname").val(val_plan).trigger("change");
                    $("#contracttype-externaltransfer-plancode").val(val_plan_code).trigger("change");
                    $("#contracttype-externaltransfer-fundname-code").val(val_fondo_code).trigger("change");
                    $("#contracttype-externaltransfer-fundname").val(val_fondo_name).trigger("change");
                    $("#contracttype-externaltransfer-manager-code").val(val_gestora_code).trigger("change");
                    
                    $('#investment-content').unblock({ message: null });
                    ko.dataFor(document.getElementById("contracttype-externaltransfer-planname")).PlanName.notifySubscribers();
                });
            }
        }
    };
    
    $("#contracttype-externaltransfer-fundname").easyAutocomplete(options_fondo);
    $("#contracttype-externaltransfer-planname").easyAutocomplete(options_plan);
}