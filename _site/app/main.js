define(["jquery","backbone","app/AppRouter"],
    function($,Backbone,AppRouter){
        // Add Router
        new AppRouter();
        Backbone.history.start();
        
        var placeholderByType = {
            "id":"Search by LDE number",
            "location":"Search by Origin/Destination",
            "city":"Search by city name"
        };

        var searchForm = $("form.search")
        var select = searchForm.find("select");
        var input = searchForm.find("input");
        function setPlaceholder(){
            var type = select.val();
            input.attr("placeholder",placeholderByType[type]);
        };
        setPlaceholder();

        $("select").on("change",function(){
            setPlaceholder();
        });

        searchForm.on("submit",function(){
            var parms = AppRouter.getParameters();
            parms.set("view","all");
            parms.set(select.val(),input.val());
            window.location.hash = parms.toString();            
            return false;
        });




    });