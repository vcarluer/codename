define(function () {
'use strict';

    return {
        load : function(onLoaded) {         
            // chargement des données, soit depuis les fichiers sources, soit depuis le localStorage s'il existe            
            require(['json!data/data.json'], function(data){
                if(onLoaded) {
                    onLoaded(data);
                }
            });
        },
        save : function () {
            
        }
    };
    
});
