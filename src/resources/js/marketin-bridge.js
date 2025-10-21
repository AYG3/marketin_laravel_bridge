import { bootstrapMarketInBridge, parseNumericId } from './marketin/core';

const locateCurrentScript = () => {
	if (typeof document === 'undefined') {
		return null;
	}

	if (document.currentScript) {
		return document.currentScript;
	}

	const scripts = Array.from(document.querySelectorAll('script'));
	return scripts.reverse().find((script) => script.src && script.src.includes('marketin-bridge')) ?? null;
};

const resolveOptionsFromAttributes = () => {
	const script = locateCurrentScript();
	if (!script) {
		return {};
	}

	const dataset = script.dataset ?? {};
	const options = {};

	if (dataset.marketinBrand) {
		options.brandId = parseNumericId(dataset.marketinBrand) ?? dataset.marketinBrand;
	}

	if (dataset.marketinCampaign) {
		options.campaignId = parseNumericId(dataset.marketinCampaign) ?? dataset.marketinCampaign;
	}

	if (dataset.marketinAffiliate) {
		options.affiliateId = parseNumericId(dataset.marketinAffiliate) ?? dataset.marketinAffiliate;
	}

	if (dataset.marketinApi) {
		options.apiEndpoint = dataset.marketinApi;
	}

	if (dataset.marketinDebug !== undefined) {
		options.debug = dataset.marketinDebug !== 'false';
	}

	if (dataset.marketinConfig) {
		try {
			const parsed = JSON.parse(dataset.marketinConfig);
			Object.assign(options, parsed);
		} catch (error) {
			console.warn('[MarketIn Demo] Unable to parse data-marketin-config JSON', error);
		}
	}

	return options;
};

bootstrapMarketInBridge(resolveOptionsFromAttributes());