define('custom:views/account/panels/test-external', ['views/record/panels/bottom'], function (Dep) {

    return Dep.extend({

        name: 'testExternal',

        // Use the standard bottom panel template for now
        // so we know tpl isn't breaking anything.
        template: 'record/panels/bottom',

        init: function () {
            Dep.prototype.init.call(this);
        },

        setup: function () {
            Dep.prototype.setup.call(this);

            console.log('TestExternal bottom panel initialised for Account', this.model && this.model.id);
        },

        data: function () {
            // Just return parent data – no rows, no custom logic yet.
            return Dep.prototype.data.call(this) || {};
        },
    });
});
