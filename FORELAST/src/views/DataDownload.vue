<template>
    <div class="data-download-container">
        <h1>Weather Data Download</h1>
        <p>Select a city and date range to download historical weather data.</p>
        <div class="search-bar-container">
            <SearchBar @city-selected="handleCitySelected" />
        </div>
        <div class="date-range-selector" v-if="selectedCity">
            <div class="date-inputs">
                <label for="start-date">Start Date:</label>
                <input
                    type="date"
                    id="start-date"
                    v-model="startDate"
                    :min="minDate"
                    :max="maxDate"
                    @change="fetchDataPreview"
                />

                <label for="end-date">End Date:</label>
                <input
                    type="date"
                    id="end-date"
                    v-model="endDate"
                    :min="minDate"
                    :max="maxDate"
                    @change="fetchDataPreview"
                />
            </div>

            <div class="data-preview" v-if="previewData.length > 0">
                <h3>Data Preview for {{ selectedCity }} (First 10 records)</h3>
                <div class="table-wrapper">
                    <table>
                        <thead>
                            <tr>
                                <th v-for="header in tableHeaders" :key="header">
                                    {{ header }}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(row, index) in previewData" :key="index">
                                <td v-for="header in tableHeaders" :key="header">
                                    {{ row[header] }}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <p class="record-count">Total records found: {{ totalRecords }}</p>
            </div>

            <button
                class="download-btn"
                @click="downloadData"
                :disabled="!isFormValid || previewData.length === 0"
            >
                Download Full CSV ({{ totalRecords }} records)
            </button>
        </div>
    </div>
</template>

<script>
import SearchBar from '@/components/SearchBar.vue';
import { ref, computed } from 'vue';

export default {
    components: {
        SearchBar
    },
    setup() {
        const selectedCity = ref(null);
        const startDate = ref('');
        const endDate = ref('');
        const previewData = ref([]);
        const totalRecords = ref(0);
        const tableHeaders = ref([]);

        const minDate = '2000-01-01';
        const maxDate = new Date().toISOString().split('T')[0];

        const handleCitySelected = (cityData) => {
            selectedCity.value = cityData.city;
            startDate.value = '';
            endDate.value = '';
            previewData.value = [];
            totalRecords.value = 0;
        };

        const isFormValid = computed(() => {
            return selectedCity.value && startDate.value && endDate.value;
        });

        const fetchDataPreview = async () => {
            if (!isFormValid.value) return;

            try {
                const normalizedCity = selectedCity.value.toLowerCase().replace(' ', '_').replace('ñ', 'n');
                const response = await fetch(
                    `http://localhost:8000/api/internal/analytics/${normalizedCity}/preview/?start_date=${startDate.value}&end_date=${endDate.value}`
                );

                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

                const data = await response.json();
                previewData.value = data.preview;
                totalRecords.value = data.total_records;

                if (data.preview.length > 0) {
                    tableHeaders.value = Object.keys(data.preview[0]);
                }

            } catch (error) {
                console.error('Error fetching preview:', error);
                previewData.value = [];
                totalRecords.value = 0;
                alert('Failed to fetch data preview. Please try again.');
            }
        };

        const downloadData = async () => {
            if (!isFormValid.value || previewData.value.length === 0) return;

            try {
                const normalizedCity = selectedCity.value.toLowerCase().replace(' ', '_').replace('ñ', 'n');
                const response = await fetch(
                    `http://localhost:8000/api/internal/analytics/${normalizedCity}/download/?start_date=${startDate.value}&end_date=${endDate.value}`
                );

                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${selectedCity.value}_weather_data_${startDate.value}_to_${endDate.value}.csv`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);

            } catch (error) {
                console.error('Error downloading data:', error);
                alert('Failed to download data. Please try again.');
            }
        };

        return {
            selectedCity,
            startDate,
            endDate,
            minDate,
            maxDate,
            previewData,
            totalRecords,
            tableHeaders,
            handleCitySelected,
            isFormValid,
            fetchDataPreview,
            downloadData
        };
    }
};
</script>

<style lang="scss" scoped>
@use '@/styles/variables.scss' as vars;


.data-download-container {
    box-sizing: border-box;
    width: 100%;
    margin: 0 auto;
    font-family: vars.$primary-font;
    text-align: center;
    background-color: vars.$panel-color;
    padding: 15px;

    h1, p {
        color: vars.$font-color;
    }

    .date-range-selector {
        .date-inputs {
            display: flex;
            flex-wrap: wrap;
            gap: 20px;
            align-items: center;
            justify-content: center;

            label {
                font-weight: 500;
            }

            input {
                font-family: vars.$primary-font;
                padding: 8px;
                border: 1px solid #ddd;
                border-radius: 4px;
            }
        }

        .data-preview {
            margin: 20px 0;
            border: 1px solid #eee;
            border-radius: 8px;
            padding: 15px;
            background-color: white;

            h3 {
                margin-bottom: 10px;
                color: vars.$font-color;
            }

            .table-wrapper {
                max-height: 400px;
                overflow-y: auto;

                table {
                    width: 100%;
                    border-collapse: collapse;

                    th, td {
                        padding: 5px;
                        border: 1px solid #ddd;
                        text-align: left;
                        font-size: vars.$larger-smalltext;
                    }

                    th {
                        background-color: #f5f5f5;
                        position: sticky;
                        top: 0;
                    }

                    tr:nth-child(even) {
                        background-color: #f9f9f9;
                    }
                }
            }

            .record-count {
                margin-top: 10px;
                font-style: italic;
                color: #666;
            }
        }

        .download-btn {
            padding: 10px 20px;
            background-color: vars.$accent-color;
            font-family: vars.$primary-font;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-weight: 500;

            &:hover {
                background-color: vars.$button-hover;
            }

            &:disabled {
                background-color: #cccccc;
                cursor: not-allowed;
            }
        }
    }
}

/* Responsive: Mobile (max-width: 768px) */
@media (max-width: 768px) {
    .data-download-container {
        h1 {
            font-size: vars.$mobile-fsize;
        }

        p {
            font-size: vars.$mobile-smalltext;
        }

        .date-range-selector {
            .date-inputs {
                flex-direction: column;
                align-items: stretch;
                gap: 10px;

                label, input {
                    width: 100%;
                }
            }

            .data-preview {
                .table-wrapper {
                    max-height: 300px;
                }

                table {
                    font-size: vars.$mobile-smalltext;
                }
            }

            .download-btn {
                width: 100%;
                padding: 12px 0;
            }
        }
    }
}

/* Responsive: Desktop and larger (min-width: 769px) */
@media (min-width: 769px) {
    .data-download-container {

        h1 {
            font-size: vars.$larger-fsize;
        }

        p {
            font-size: vars.$larger-smalltext;
        }
        
        .date-range-selector {

            .download-btn {
                width: auto;
            }
        }
    }
}

</style>