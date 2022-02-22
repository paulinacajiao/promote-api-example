// Anypoint API Manager API Wrapper
// Implements API calls required to promote API

const Req = require("request");
const Promise = require("promise");

/*
 * Promote all the APIs defined in configuratin file
 */
function promoteApis(apis, anypointInfo) {

	return Promise.all(apis.map((api) => {
		console.log("Api Instance ID	   : " + api.apiInstanceId);
		console.log("Api Implementarion url: " + api.proxyurl) ;
		return promoteApi(api.apiInstanceId, anypointInfo, api.proxyurl);
	}));

}

/*
 * Promotes API from source environment to the target environment. API is defined by API ID.
 * Returns api asset id and api version in JSON format.
 */
function promoteApi(apiId, anypointInfo, proxyurl) {

	return new Promise(function(resolve, reject) {

		Req.post({
			"headers": {"content-type": "application/json", "Authorization": anypointInfo.token}, 
			"url": "https://anypoint.mulesoft.com/apimanager/api/v1/organizations/" + anypointInfo.orgId +
				"/environments/" + anypointInfo.targetEnvId + "/apis",
			"body": JSON.stringify(
				{"promote":{
    				"originApiId": apiId,
    				"policies":{"allEntities": true},
    				"tiers":{"allEntities": true},
    				"alerts":{"allEntities": true}
    			}})
		}, (error, response, body) => {
		    if(error) {
		    	reject(error);
		    } else {
			

			    var jsonBody = JSON.parse(body);

				// patch API to modify the Implementation url value
				patchApi(jsonBody.id, anypointInfo, proxyurl) ;

				console.dir("Promoted Autodiscovery instance name: " + jsonBody.autodiscoveryInstanceName);
				console.log("Promoted Autodiscovery Body: " , jsonBody );
				resolve({"apiAssetId": jsonBody.assetId, 
					"apiVersion": jsonBody.autodiscoveryInstanceName, 
					"productVersion": jsonBody.productVersion,
					"apiInstanceId": jsonBody.id,
					"originApiInstanceId": apiId});
		    }

		});
		
	});

}

function patchApi(apiId, anypointInfo, proxyurl) {

	return new Promise(function(resolve, reject) {
		console.log("Patch API: " , apiId );
		Req.patch({
			"headers": {"content-type": "application/json", "Authorization": anypointInfo.token}, 
			"url": "https://anypoint.mulesoft.com/apimanager/api/v1/organizations/" + anypointInfo.orgId +
				"/environments/" + anypointInfo.targetEnvId + "/apis/" + apiId,
			"body": JSON.stringify(
				{"endpoint":{
    				"uri": proxyurl
    			},
				"providerId": null})
		}, (error, response, body) => {
		    if(error) {
		    	reject(error);
		    } else {
			    var jsonBody = JSON.parse(body);
				//console.dir("Promoted Autodiscovery instance name: " + jsonBody.autodiscoveryInstanceName);
				console.log("Proxy API patched body response: " , jsonBody );
				//resolve({"apiAssetId": jsonBody.assetId, 
				//	"apiVersion": jsonBody.autodiscoveryInstanceName, 
				//	"productVersion": jsonBody.productVersion,
				//	"apiInstanceId": jsonBody.id,
				//	"originApiInstanceId": apiId});
		    }

		});

	});

}

module.exports.promoteApis 						= promoteApis;