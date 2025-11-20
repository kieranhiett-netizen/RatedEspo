define('custom:views/account/panels/test-external', ['views/record/panels/bottom'], function (Dep) {

    return Dep.extend({

        name: 'testExternal',

        // Use a stock template so .tpl can't break anything
        template: 'custom:account/panels/test-external',
        
        init: function () {
            Dep.prototype.init.call(this);
        },

        setup: function () {
            Dep.prototype.setup.call(this);
            console.log('TestExternal minimal panel loaded for Account', this.model && this.model.id);
        },

        data: function () {
            // Just inherit parent data, no custom stuff
            return Dep.prototype.data.call(this) || {};
        },
    });
});
