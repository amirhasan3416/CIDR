import React, { useState } from 'react';
import { Network, Calculator, Github, Info, BookOpen } from 'lucide-react';
import { calculateCIDR, isValidIP, isValidSubnetMask, cidrToSubnetMask } from './utils/cidrCalculator';

function App() {
  const [ip, setIp] = useState('192.168.1.0');
  const [mask, setMask] = useState('24');
  const [result, setResult] = useState(calculateCIDR(ip, 24));
  const [error, setError] = useState('');

  const handleCalculate = () => {
    if (!isValidIP(ip)) {
      setError('Please enter a valid IP address');
      setResult(null);
      return;
    }

    // Check if input is in CIDR format (number) or subnet mask format
    if (mask.includes('.')) {
      if (!isValidSubnetMask(mask)) {
        setError('Please enter a valid subnet mask (e.g., 255.255.255.0)');
        setResult(null);
        return;
      }
    } else {
      const cidr = Number(mask);
      if (isNaN(cidr) || cidr < 0 || cidr > 32) {
        setError('CIDR must be between 0 and 32');
        setResult(null);
        return;
      }
    }

    setError('');
    setResult(calculateCIDR(ip, mask));
  };

  // Helper function to display the current format
  const getDisplayMask = () => {
    if (mask.includes('.')) {
      return mask;
    }
    const cidr = Number(mask);
    if (!isNaN(cidr) && cidr >= 0 && cidr <= 32) {
      return `${cidrToSubnetMask(cidr)} (/${cidr})`;
    }
    return mask;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 flex flex-col">
      <div className="max-w-4xl mx-auto flex-grow">
        {/* Header */}
        <div className="text-center mb-8 pt-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Calculator className="w-10 h-10 text-indigo-600" />
            <h1 className="text-4xl font-bold text-gray-800">CIDR Calculator</h1>
          </div>
          <p className="text-gray-600">Calculate subnet information from IP address and CIDR notation or subnet mask</p>
        </div>

        {/* Input Section */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="ip" className="block text-sm font-medium text-gray-700 mb-1">
                IP Address
              </label>
              <input
                type="text"
                id="ip"
                value={ip}
                onChange={(e) => setIp(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="e.g., 192.168.1.0"
              />
            </div>
            <div>
              <label htmlFor="mask" className="block text-sm font-medium text-gray-700 mb-1">
                Subnet Mask / CIDR
              </label>
              <input
                type="text"
                id="mask"
                value={mask}
                onChange={(e) => setMask(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="e.g., 24 or 255.255.255.0"
              />
              {!error && mask && (
                <p className="mt-1 text-sm text-gray-500">
                  Current mask: {getDisplayMask()}
                </p>
              )}
            </div>
          </div>
          <button
            onClick={handleCalculate}
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
          >
            <Network className="w-5 h-5" />
            Calculate
          </button>
          {error && (
            <p className="mt-2 text-red-600 text-sm">{error}</p>
          )}
        </div>

        {/* Results Section */}
        {result && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Results</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Valid IP Range</h3>
                  <p className="text-lg font-semibold text-gray-800">{result.ipRange}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Number of Subnets</h3>
                  <p className="text-lg font-semibold text-gray-800">{result.numSubnets.toLocaleString()}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Valid IPs per Subnet</h3>
                  <p className="text-lg font-semibold text-gray-800">{result.ipsPerSubnet.toLocaleString()}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Network IP</h3>
                  <p className="text-lg font-semibold text-gray-800">{result.networkIP}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Broadcast IP</h3>
                  <p className="text-lg font-semibold text-gray-800">{result.broadcastIP}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="max-w-4xl mx-auto w-full mt-12 bg-white rounded-lg shadow-lg p-6">
        <div>
          <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2 mb-4">
            <BookOpen className="w-6 h-6 text-indigo-600" />
            CIDR (Classless Inter-Domain Routing) & Its Calculation
          </h3>
          <div className="space-y-6">
            <div>
              <h4 className="text-lg font-semibold text-gray-700 mb-2">What is CIDR?</h4>
              <p className="text-gray-600">
                CIDR (Classless Inter-Domain Routing) is a method for allocating IP addresses more efficiently than traditional class-based addressing. It allows for variable-length subnet masking (VLSM), enabling better utilization of IP address space. CIDR notation represents an IP address followed by a slash ("/") and a number indicating the number of bits used for the network portion (e.g., 192.168.1.0/24).
              </p>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-gray-700 mb-2">CIDR Calculation Steps</h4>
              <div className="space-y-4 text-gray-600">
                <div>
                  <h5 className="font-semibold">1. Subnet Mask</h5>
                  <p>The "/N" value defines how many bits are used for the network. For example, /24 means the first 24 bits are for the network, and the remaining 8 bits are for hosts.</p>
                </div>
                <div>
                  <h5 className="font-semibold">2. Number of Hosts</h5>
                  <p>Use the formula 2^(Total Host Bits) - 2 (subtracting 2 for network and broadcast addresses).</p>
                  <p className="text-sm mt-1">Example: /24 → 32 - 24 = 8 host bits → 2⁸ - 2 = 254 hosts.</p>
                </div>
                <div>
                  <h5 className="font-semibold">3. Network Range</h5>
                  <p>The first address is the network address, and the last is the broadcast address.</p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-gray-700 mb-2">Example Calculation</h4>
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="font-semibold mb-2">For 192.168.1.0/26:</p>
                <ul className="list-disc ml-5 space-y-2 text-gray-600">
                  <li>Subnet Mask: 255.255.255.192</li>
                  <li>Total Hosts: 2⁶ - 2 = 62</li>
                  <li>Subnet Ranges:
                    <ul className="list-none ml-4 mt-1">
                      <li>First: 192.168.1.0 (Network Address)</li>
                      <li>Last: 192.168.1.63 (Broadcast Address)</li>
                    </ul>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;