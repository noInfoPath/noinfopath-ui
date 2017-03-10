describe("Testing noArea provider", function(){
	var noArea, $httpBackend, $timeout, $compile, $rootScope, noConfig;

	beforeEach(function(){
		//module("ui.router");
		module("noinfopath.data");
		module("noinfopath.logger");
		module("noinfopath.ui");

		module(function($provide, $stateProvider){
			$provide.provider("$state", $stateProvider);
		});

		inject(function($injector){
			noConfig = $injector.get("noConfig");
			noArea = $injector.get("noArea");
			$httpBackend = $injector.get("$httpBackend");
			$timeout = $injector.get("$timeout");
			$compile = $injector.get("$compile");
			$rootScope = $injector.get("$rootScope");
		});
	});

	xit("should be instanciated", function(){
		expect(noArea).toBeDefined();
		expect(noArea.whenReady).toBeDefined();
	});

	xit("should wait for whenReady to resolve", function(done){
		$httpBackend
			.when("GET", "/config.json")
			.respond(200, mockConfig);

			noConfig.whenReady()
				.then(function(){
					noArea.whenReady()
						.then(function(){
							expect(noArea.menuConfig).toBeDefined();
						})
						.catch(function(err){
							console.error(err);
						})
						.finally(done);
				})
				.catch(function(err){
					console.error(err);
					done();
				});

		$timeout.flush();
		$httpBackend.flush();
	});

	xit("should render the menu", function(done){
		$httpBackend
			.when("GET", "/config.json")
			.respond(200, mockConfig);

		noConfig.whenReady()
			.then(function(){
				noArea.whenReady()
					.then(function(){
						expect(noArea.menuConfig).toBeDefined();

						var h = "<ul class=\"nav navbar-nav\" no-area-menu></ul>",
							r = $compile(h)($rootScope.$new());

							expect(r.html()).toBeDefined();
					})
					.catch(function(err){
						console.error(err);
					})
					.finally(done);
			})
			.catch(function(err){
				console.error(err);
				done();
			});

		$rootScope.$digest();

		$timeout.flush();
		$httpBackend.flush();

	});
});
