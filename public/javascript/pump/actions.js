if (_.isObject(Pump) && _.isUndefined(Pump.Actions)){
    var Actions = Pump.Actions = new ActivityStreams.Actions();

    //Register action handlers
    var fooHandler = new ActivityStreams.ActionHandler('fooHandler');
    fooHandler.run = function(action, activity) {
        alert("FooHandler has been triggered for action: " + action);
        console.log(activity);
    };
    Actions.registerActionHandler(fooHandler);

    var httpActionHandler = new ActivityStreams.HttpActionHandler();
    httpActionHandler.run = function(action, handlerData, context) {
        if (handlerData.method == 'GET') {
            context.$('.activity-content').append('<p>GET ' + handlerData.url +'</p>');
            context.$('.activity-content').append('<blockquote></blockquote>');
            context.$('.activity-content').find('blockquote').load(handlerData.url);
        } else {
            throw new ActivityStreams.ActionsException(handlerData.method + " is not implemented");
        }
    };

    Actions.registerActionHandler(httpActionHandler);
    Actions.registerActionHandler(new ActivityStreams.EmbedActionHandler());
    Actions.registerActionHandler(new ActivityStreams.IntentActionHandler());

    //Setup view render listener, ready is called after each view is rendered.
    var __oldReady = Pump.TemplateView.prototype.ready;
    Pump.TemplateView.prototype.ready = function(){
        __oldReady.apply(this, arguments);
        if(this.model && this.model.get("object")){
            var actions = Actions.getActionsWithHandlers(this.model.get("object"));
            _.each(actions, function(action){
                this.$('[data-action='+action+']').removeClass('hide');
            }, this);
        }
    };

}
