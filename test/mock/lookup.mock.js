var lookupMocks =  "<no-lookup model=\"dnasample.DNATestingAgencyID\" list-source=\"LU_VirusTestingAgency\" list-location=\"sessionStorage\" text-field=\"Description\" value-field=\"VirusTestingAgencyID\" order-by=\"VirusTestingAgencyID\">
						<select class=\"form-control ng-pristine ng-valid ng-scope ng-touched\" ng-model=\"dnasample.DNATestingAgencyID\" ng-options=\"item.VirusTestingAgencyID as item.Description for item in LU_VirusTestingAgency | orderBy : 'VirusTestingAgencyID'\">
							<option value=\"?\" selected=\"selected\" label=\"\"></option>
							<option value=\"0\" label=\"HCRL\">HCRL</option>
							<option value=\"1\" label=\"OSU Plant Health\">OSU Plant Health</option>
							<option value=\"2\" label=\"AgDia\">AgDia</option>
							<option value=\"3\" label=\"ODA\">ODA</option>
						</select>
					</no-lookup>"