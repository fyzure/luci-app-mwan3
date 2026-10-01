'use strict';
'require baseclass';
'require rpc';
'require mwan3.components as components';

const callMwan3Status = rpc.declare({
	object: 'mwan3',
	method: 'status',
	params: ['section'],
	expect: {  },
});

return baseclass.extend({
	title: _('MultiWAN Manager'),

	load: function() {
		return Promise.all([
			callMwan3Status("interfaces"),
		]);
	},

	render: function (result) {
		if (!result[0].interfaces)
			return null;

		components.loadStyle();

		var container = E('div', { 'id': 'mwan3-service-status' });

		for (var iface in result[0].interfaces) {
			var d = result[0].interfaces[iface];
			var si = components.statusInfo(d);
			var css;

			switch (si.severity) {
				case 'success':
					css = 'success';
					break;
				case 'danger':
					css = 'danger';
					break;
				default:
					css = 'warning';
					break;
			}

			var children = [
				E('div', {}, [ E('strong', {}, _('Interface') + ':\u00a0'), iface ]),
				E('div', {}, [ E('strong', {}, _('Status') + ':\u00a0'), si.label ]),
			];

			if (si.duration != null)
				children.push(E('div', {}, [ E('strong', {}, si.durationLabel + ':\u00a0'), '%t'.format(si.duration) ]));

			container.appendChild(E('div', { 'class': 'alert-message ' + css }, children));
		}

		return container;
	}
});
