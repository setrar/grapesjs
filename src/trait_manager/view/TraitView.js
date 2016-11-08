define(['backbone'], function (Backbone) {

	return Backbone.View.extend({

		events:{
			'change': 'onChange'
		},

		initialize: function(o) {
			var md = this.model;
			this.config = o.config || {};
			this.pfx = this.config.stylePrefix || '';
			this.ppfx = this.config.pStylePrefix || '';
			this.target = md.get('target');
			this.className = this.pfx + 'trait';
			this.labelClass = this.ppfx + 'label';
			this.fieldClass = this.ppfx + 'field ' + this.ppfx + 'field-' + md.get('type');
			this.inputhClass = this.ppfx + 'input-holder';
			md.off('change:value', this.onValueChange);
			this.listenTo(md, 'change:value', this.onValueChange);
			this.tmpl = '<div class="' + this.fieldClass +'"><div class="' + this.inputhClass +'"></div></div>';
		},

		/**
		 * Fires when the input is changed
		 * @private
		 */
		onChange: function() {
			this.model.set('value', this.getInputEl().value);
		},

		/**
		 * On change callback
		 * @private
		 */
		onValueChange: function() {
			var m = this.model;
			var trg = this.target;
			var name = m.get('name');
			var value = m.get('value');
			// Chabge property if requested otherwise attributes
			if(m.get('changeProp')){
				trg.set(name, value);
			}else{
				var attrs = _.clone(trg.get('attributes'));
				attrs[name] = value;
				trg.set('attributes', attrs);
			}
		},

		/**
		 * Render label
		 * @private
		 */
		renderLabel: function() {
			this.$el.html('<div class="' + this.labelClass + '">' + this.getLabel() + '</div>');
		},

		/**
		 * Returns label for the input
		 * @return {string}
		 * @private
		 */
		getLabel: function() {
			var model = this.model;
			var label = model.get('label') || model.get('name');
			return label.charAt(0).toUpperCase() + label.slice(1).replace(/-/g,' ');
		},

		/**
		 * Returns input element
		 * @return {HTMLElement}
		 * @private
		 */
		getInputEl: function() {
			if(!this.$input){
				var md = this.model;
				var name = md.get('name');
				var opts = {
					placeholder: md.get('placeholder') || md.get('default'),
					type: md.get('type') || 'text',
					value: md.get('value')
				};
				if(md.get('changeProp')){
					opts.value = this.target.get(name);
				}
				if(md.get('min'))
					opts.min = md.get('min');
				if(md.get('max'))
					opts.max = md.get('max');
				this.$input = $('<input>', opts);
			}
			return this.$input.get(0);
		},

		/**
		 * Renders input
		 * @private
		 * */
		renderField: function(){
			if(!this.$input){
				this.$el.append(this.tmpl);
				var el = this.getInputEl();
				this.$el.find('.' + this.inputhClass).prepend(el);
			}
		},

		render : function() {
			this.renderLabel();
			this.renderField();
			this.el.className = this.className;
			return this;
		},

	});

});