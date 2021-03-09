/**
 *
 * Get RTT (Round-trip delay time)
 *
 * @static
 * @param {string} url - For example : 8.8.8.8
 * @returns
 * @memberof Ping
 */

const pingIp = ({
  url,
}) => {
  return new Promise((reslove, reject) => {
    const started = new Date().getTime();
    const xhr = new XMLHttpRequest();

    let timeCount = 0;
    const second = 1000;
    const thirtySecond = 30 * second;
    let counter = null;

    xhr.open('HEAD', url, true);

    xhr.onload = () => {
      clearInterval(counter);
      console.log('xhr onload!');
      const ended = new Date().getTime();
      const latencyMs = ended - started;
      const status = xhr.status || 'none';
      if (status < 400) {
        xhr.abort();
        reslove({
          isSuccess: true,
          ms: latencyMs,
          url,
          status,
        });
      } else {
        reject({
          errorType: 'error code',
          isSuccess: false,
          ms: latencyMs,
          url,
          status,
        });
      }
    };

    xhr.ontimeout = () => {
      clearInterval(counter);
      console.log('xhr ontimeout!');
      const ended = new Date().getTime();
      const latencyMs = ended - started;
      const status = xhr.status || 'none';
      xhr.abort();
      reject({
        errorType: 'timeout',
        isSuccess: false,
        ms: latencyMs,
        url,
        status,
      });
    };

    xhr.onerror = () => {
      clearInterval(counter);
      console.log('xhr onerror!');
      const ended = new Date().getTime();
      const latencyMs = ended - started;
      const status = xhr.status || 'none';
      xhr.abort();
      reject({
        errorType: 'error',
        isSuccess: false,
        ms: latencyMs,
        url,
        status,
      });
    }

    counter = setInterval(() => {
      timeCount += second;
      if (timeCount >= thirtySecond) {
        xhr.abort();
        clearInterval(counter);
        reject({
          errorType: 'timeout',
          isSuccess: false,
          ms: Infinity,
          url,
        });
      }
    }, second);

    xhr.send(null);


  });
}

const getConnectionQuality = (latency) => {
  if (latency <= 500) return 100;
  else if (latency > 500 && latency <= 2000) return 50;
  else return 0;
}

const getNetworkQualityClass = (quality) => {
  const mapNetworkQualityColor = {
    100: 'success',
    50: 'warning',
    0: 'error',
  };
  return mapNetworkQualityColor[quality];
}

const getNetworkQualityColorByClass = (classname) => {
  const mapNetworkQualityColor = {
    'success': '#4caf50',
    'warning': '#fb8c00',
    'error': '#ff5252',
  };
  return mapNetworkQualityColor[classname];
}
  
const getIpAddress = () => {
  return new Promise((reslove) => {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://api.ipify.org/?format=json', true);
    xhr.onload = () => {
      const status = xhr.status;
      if (status < 400) {
        try {
          const { ip } = JSON.parse(xhr.response);
          reslove(ip ? ip : 'unknow');
        } catch(e) {
          reslove('unknow');
        }
      } else {
        reslove('unknow');
      }
    };
    xhr.onerror = () => {
      xhr.abort();
    }
    xhr.ontimeout = () => {
      xhr.abort();
    }
    xhr.send(null);
  });
}

const sha256 = async (message) => {
  // encode as UTF-8
  const msgBuffer = new TextEncoder('utf-8').encode(message);
  // hash the message
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  // convert ArrayBuffer to Array
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  // convert bytes to hex string
  const hashHex = hashArray.map(b => ('00' + b.toString(16)).slice(-2)).join('');
  return hashHex;
}

export { pingIp, getConnectionQuality, getNetworkQualityClass, getNetworkQualityColorByClass, getIpAddress, sha256 };
    