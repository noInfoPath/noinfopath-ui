
describe("Testing noLookup directive", function(){

	//Any dependencies that need to be injected into the directive
	var $compile;

	//Loading the module noLookup before each test
	beforeEach(function() {
		module('noinfopath-ui');
	});	

	//Storing any info into each dependency for usage later on
	beforeEach(inject(function(_$compile_){
		$compile = _$compile_;
	}));


	xit("Should replace the directive with the appropriate html code", function(){
		var results = $("<no-lookup model=\"dnasample.DNATestingAgencyID\" list-source=\"LU_VirusTestingAgency\" list-location=\"sessionStorage\" text-field=\"Description\" value-field=\"VirusTestingAgencyID\" order-by=\"VirusTestingAgencyID\"></no-lookup>")($rootscope);
	
		$rootscope.digest();

		expect(results).toEqual(lookupMocks);
	});
});