$(function(){

    var public_spreadsheet_url = '0AhQVbLcvyJvIdEEtX0dkOG1Xd0lpUXNualEwYVVFbEE';

    Tabletop.init( { key: public_spreadsheet_url,
                     callback: showInfo,
                     simpleSheet: false,
                     wanted: [ "Salt River Data", "Buffalo River Data", "L Buffalo River ", "Kakisa River Data", "Hay River West Channel", "Slave Mouth Data" ]
        } )

    function showInfo(data, tabletop) {

      console.log(data);
    }

})