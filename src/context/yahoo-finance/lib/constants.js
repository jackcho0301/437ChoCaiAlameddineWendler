const PROXY_URL = 'https://cors-anywhere.herokuapp.com/';

// exports.HISTORICAL_CRUMB_URL = 'https://finance.yahoo.com/quote/$SYMBOL/history';
exports.HISTORICAL_CRUMB_URL = 'http://localhost:3001/price/quote/$SYMBOL/history';
exports.HISTORICAL_DOWNLOAD_URL = 'https://query1.finance.yahoo.com/v7/finance/download/$SYMBOL';
exports.SNAPSHOT_URL = 'https://query2.finance.yahoo.com/v10/finance/quoteSummary/$SYMBOL';
