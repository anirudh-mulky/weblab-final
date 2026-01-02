
const NOMINATIM_API = 'https://nominatim.openstreetmap.org/search';
const NASA_POWER_API = 'https://power.larc.nasa.gov/api/temporal/climatology/point';

const DEFAULT_SYSTEM_SIZE_KW = 5;
const DEFAULT_COST_PER_KWH = 0.12;
const SYSTEM_EFFICIENCY = 0.85;

function classifySolarPotential(irradiance) {

  if (irradiance >= 5.5) {
    return {
      level: 'High',
      color: '#10b981',
      message: 'Excellent solar potential! Your location receives abundant sunlight year-round.'
    };
  } else if (irradiance >= 4.0) {
    return {
      level: 'Medium',
      color: '#f59e0b',
      message: 'Good solar potential. Solar panels would work well at your location.'
    };
  } else {
    return {
      level: 'Low',
      color: '#ef4444',
      message: 'Moderate solar potential. Solar panels are still viable but with lower output.'
    };
  }
}

async function getCoordinates(location) {
  try {
    const params = new URLSearchParams({
      q: location,
      format: 'json',
      limit: 1,
      addressdetails: 1
    });

    const response = await fetch(`${NOMINATIM_API}?${params}`, {
      headers: {
        'User-Agent': 'SolarEcommerce/1.0'
      }
    });

    if (!response.ok) {
      throw new Error(`Geocoding API error: ${response.status}`);
    }

    const data = await response.json();

    if (!data || data.length === 0) {
      throw new Error('Location not found. Please try a different city or ZIP code.');
    }

    const result = data[0];
    return {
      latitude: parseFloat(result.lat),
      longitude: parseFloat(result.lon),
      displayName: result.display_name
    };
  } catch (error) {
    console.error('Geocoding error:', error);
    throw new Error('Unable to find location. Please check your input and try again.');
  }
}

async function getSolarIrradiance(latitude, longitude) {
  try {

    const params = new URLSearchParams({
      parameters: 'ALLSKY_SFC_SW_DWN',
      community: 'RE',
      longitude: longitude.toString(),
      latitude: latitude.toString(),
      format: 'JSON'
    });

    const response = await fetch(`${NASA_POWER_API}?${params}`);

    if (!response.ok) {
      throw new Error(`NASA API error: ${response.status}`);
    }

    const data = await response.json();

    if (!data.properties || !data.properties.parameter || !data.properties.parameter.ALLSKY_SFC_SW_DWN) {
      throw new Error('Solar data not available for this location.');
    }

    const irradianceData = data.properties.parameter.ALLSKY_SFC_SW_DWN;

    const annualKeys = Object.keys(irradianceData).filter(key => key.includes('ANN'));

    if (annualKeys.length > 0) {
      const annualValue = irradianceData[annualKeys[0]];
      if (typeof annualValue === 'number' && !isNaN(annualValue)) {
        return annualValue;
      }
      if (typeof annualValue === 'string') {
        const parsed = parseFloat(annualValue);
        if (!isNaN(parsed)) return parsed;
      }
    }

    const monthlyValues = [];
    Object.keys(irradianceData).forEach(key => {
      const value = irradianceData[key];
      if (typeof value === 'number' && !isNaN(value) && value > 0) {
        monthlyValues.push(value);
      } else if (typeof value === 'string') {
        const parsed = parseFloat(value);
        if (!isNaN(parsed) && parsed > 0) {
          monthlyValues.push(parsed);
        }
      }
    });

    if (monthlyValues.length === 0) {
      throw new Error('No valid solar irradiance data found for this location.');
    }

    const annualAverage = monthlyValues.reduce((sum, val) => sum + val, 0) / monthlyValues.length;
    return annualAverage;

  } catch (error) {
    console.error('NASA API error:', error);
    throw new Error('Unable to fetch solar data. Please try again later.');
  }
}

function calculateEnergyOutput(irradiance, systemSizeKW = DEFAULT_SYSTEM_SIZE_KW) {

  const peakSunHours = irradiance;

  const yearlyEnergy = Math.round(
    systemSizeKW * peakSunHours * 365 * SYSTEM_EFFICIENCY
  );

  return yearlyEnergy;
}

function calculateSavings(yearlyEnergy, costPerKWh = DEFAULT_COST_PER_KWH) {

  const yearlySavings = Math.round(yearlyEnergy * costPerKWh);
  return yearlySavings;
}

function showLoading() {
  document.getElementById('loading-state').style.display = 'block';
  document.getElementById('error-state').style.display = 'none';
  document.getElementById('result-card').style.display = 'none';
}

function hideLoading() {
  document.getElementById('loading-state').style.display = 'none';
}

function showError(message) {
  document.getElementById('loading-state').style.display = 'none';
  document.getElementById('error-state').style.display = 'block';
  document.getElementById('result-card').style.display = 'none';
  document.getElementById('error-message').textContent = message;
}

function showResults(irradiance, yearlyEnergy, yearlySavings, classification) {
  document.getElementById('loading-state').style.display = 'none';
  document.getElementById('error-state').style.display = 'none';

  const resultCard = document.getElementById('result-card');
  const scoreElement = document.getElementById('result-score');
  const scoreLabel = document.getElementById('score-label');
  const recommendation = document.getElementById('recommendation');
  const irradianceElement = document.getElementById('irradiance-value');
  const energyElement = document.getElementById('yearly-energy');
  const savingsElement = document.getElementById('yearly-savings');

  irradianceElement.textContent = `${irradiance.toFixed(2)} kWh/m²/day`;

  const score = Math.min(100, Math.round((irradiance / 6.5) * 100));
  scoreElement.textContent = score;
  scoreElement.style.color = classification.color;

  scoreLabel.textContent = `${classification.level} Solar Potential`;
  recommendation.textContent = classification.message;

  energyElement.textContent = `${yearlyEnergy.toLocaleString()} kWh`;
  savingsElement.textContent = `$${yearlySavings.toLocaleString()}`;

  resultCard.style.display = 'block';
  resultCard.style.animation = 'fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
  resultCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

async function checkSolarAvailability(location) {
  try {
    showLoading();

    const coords = await getCoordinates(location);
    console.log('Coordinates:', coords);

    const irradiance = await getSolarIrradiance(coords.latitude, coords.longitude);
    console.log('Solar Irradiance:', irradiance, 'kWh/m²/day');

    const classification = classifySolarPotential(irradiance);

    const yearlyEnergy = calculateEnergyOutput(irradiance);
    const yearlySavings = calculateSavings(yearlyEnergy);

    hideLoading();
    showResults(irradiance, yearlyEnergy, yearlySavings, classification);

  } catch (error) {
    console.error('Error checking solar availability:', error);
    hideLoading();
    showError(error.message || 'An unexpected error occurred. Please try again.');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('availability-form');
  const checkBtn = document.getElementById('check-btn');
  const locationInput = document.getElementById('location-input');

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const location = locationInput.value.trim();

      if (!location) {
        showError('Please enter a city or ZIP code.');
        return;
      }

      checkBtn.disabled = true;
      const originalText = checkBtn.textContent;
      checkBtn.textContent = 'Checking...';

      try {
        await checkSolarAvailability(location);
      } finally {

        checkBtn.disabled = false;
        checkBtn.textContent = originalText;
      }
    });
  }
});
