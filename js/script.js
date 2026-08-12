document.addEventListener('DOMContentLoaded', function () {
    // ----------------------------------------------------
    // 1. HIGHLIGHT & AUTO-CLOSE NAVIGASI NAVBAR
    // ----------------------------------------------------
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');

    navLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        
        if (linkHref) {
            const pageName = linkHref.split('#')[0];
            
            if (pageName === currentPath) {
                link.classList.add('active');
            }
        }

        // Auto-close navbar di layar HP saat link diklik
        link.addEventListener('click', function () {
            const navbarCollapse = document.getElementById('mainNav');
            if (navbarCollapse && navbarCollapse.classList.contains('show')) {
                if (typeof bootstrap !== 'undefined') {
                    const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse) || new bootstrap.Collapse(navbarCollapse);
                    bsCollapse.hide();
                }
            }
        });
    });

    // ----------------------------------------------------
    // 2.2 DIAGRAM PERSEBARAN RT (BAB II - KARAKTERISTIK WILAYAH)
    // ----------------------------------------------------
    const canvasRT = document.getElementById('chartPersebaranRT');
    if (canvasRT && typeof Chart !== 'undefined') {
        const ctx = canvasRT.getContext('2d');

        const baseColorsRT = [
            '#4285F4', // RT 01 RW 01
            '#EA4335', // RT 02 RW 01
            '#FBBC05', // RT 01 RW 02
            '#34A853', // RT 02 RW 02
            '#FF6D00', // RT 01 RW 03
            '#46BDC6', // RT 02 RW 03
            '#7BAAF7', // RT 01 RW 04
            '#F07B72'  // RT 02 RW 04
        ];

        const fadedColorsRT = [
            'rgba(66, 133, 244, 0.25)',
            'rgba(234, 67, 53, 0.25)',
            'rgba(251, 188, 5, 0.25)',
            'rgba(52, 168, 83, 0.25)',
            'rgba(255, 109, 0, 0.25)',
            'rgba(70, 189, 198, 0.25)',
            'rgba(123, 170, 247, 0.25)',
            'rgba(240, 123, 114, 0.25)'
        ];

        new Chart(ctx, {
            type: 'pie',
            data: {
                labels: [
                    'RT 01 RW 01',
                    'RT 02 RW 01',
                    'RT 01 RW 02',
                    'RT 02 RW 02',
                    'RT 01 RW 03',
                    'RT 02 RW 03',
                    'RT 01 RW 04',
                    'RT 02 RW 04'
                ],
                datasets: [{
                    data: [15, 14, 20, 23, 14, 11, 24, 24],
                    backgroundColor: [...baseColorsRT],
                    borderColor: '#ffffff',
                    borderWidth: 2,
                    hoverOffset: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: { animateRotate: true, animateScale: true, duration: 1000 },
                onHover: (event, chartElement, chart) => {
                    const dataset = chart.data.datasets[0];
                    if (chartElement.length > 0) {
                        const activeIndex = chartElement[0].index;
                        dataset.backgroundColor = dataset.data.map((_, index) => {
                            return index === activeIndex ? baseColorsRT[index] : fadedColorsRT[index];
                        });
                    } else {
                        dataset.backgroundColor = [...baseColorsRT];
                    }
                    chart.update('none');
                },
                plugins: {
                    legend: {
                        position: 'right',
                        labels: { 
                            font: { family: 'Plus Jakarta Sans', size: 12, weight: '500' }, 
                            usePointStyle: true, 
                            boxWidth: 10, 
                            padding: 12 
                        }
                    },
                    tooltip: {
                        backgroundColor: '#1f2937',
                        padding: 10,
                        titleFont: { family: 'Plus Jakarta Sans', size: 13, weight: 'bold' },
                        bodyFont: { family: 'Plus Jakarta Sans', size: 12 },
                        callbacks: {
                            label: function (context) {
                                const label = context.label || '';
                                const value = context.raw || 0;
                                const total = context.dataset.data.reduce((acc, val) => acc + val, 0);
                                const percentage = ((value / total) * 100).toFixed(1);
                                return `${label}: ${value} KK (${percentage}%)`;
                            }
                        }
                    }
                }
            }
        });
    }

    // ----------------------------------------------------
    // 3. DIAGRAM STATUS KEPEMILIKAN RUMAH (PASAL 3.1)
    // ----------------------------------------------------
    const canvasKepemilikan = document.getElementById('chartKepemilikanRumah');
    if (canvasKepemilikan && typeof Chart !== 'undefined') {
        const ctxKepemilikan = canvasKepemilikan.getContext('2d');

        const colorTealSolid = '#008080';
        const colorTealFaded = 'rgba(0, 128, 128, 0.25)';

        new Chart(ctxKepemilikan, {
            type: 'bar',
            data: {
                labels: ['Bebas sewa (menumpang)', 'Milik sendiri'],
                datasets: [{
                    label: 'Jumlah (KK)',
                    data: [134, 11],
                    backgroundColor: [colorTealSolid, colorTealSolid],
                    borderColor: colorTealSolid,
                    borderWidth: 1,
                    borderRadius: 4,
                    barPercentage: 0.5
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: {
                    duration: 800,
                    easing: 'easeOutQuart'
                },
                onHover: (event, chartElement, chart) => {
                    if (chartElement.length > 0) {
                        const activeIndex = chartElement[0].index;
                        const dataset = chart.data.datasets[0];

                        dataset.backgroundColor = dataset.data.map((_, index) => {
                            return index === activeIndex ? colorTealSolid : colorTealFaded;
                        });
                    } else {
                        chart.data.datasets[0].backgroundColor = [colorTealSolid, colorTealSolid];
                    }
                    chart.update('none');
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: '#1f2937',
                        padding: 10,
                        titleFont: {
                            family: 'Plus Jakarta Sans',
                            size: 13,
                            weight: 'bold'
                        },
                        bodyFont: {
                            family: 'Plus Jakarta Sans',
                            size: 12
                        },
                        callbacks: {
                            label: function (context) {
                                const value = context.raw || 0;
                                const total = 145;
                                const percentage = ((value / total) * 100).toFixed(1);
                                return `Jumlah: ${value} KK (${percentage}%)`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 150,
                        ticks: {
                            stepSize: 50,
                            font: {
                                family: 'Plus Jakarta Sans',
                                size: 12
                            }
                        },
                        title: {
                            display: true,
                            text: 'Jumlah (KK)',
                            color: '#1f2937',
                            font: {
                                family: 'Plus Jakarta Sans',
                                size: 12,
                                weight: '600'
                            }
                        },
                        grid: {
                            color: '#e5e7eb'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Kategori',
                            color: '#1f2937',
                            font: {
                                family: 'Plus Jakarta Sans',
                                size: 12,
                                weight: '600'
                            }
                        },
                        ticks: {
                            font: {
                                family: 'Plus Jakarta Sans',
                                size: 12
                            }
                        },
                        grid: {
                            display: false
                        }
                    }
                }
            }
        });
    }

    // ----------------------------------------------------
    // 4. DIAGRAM JENIS ATAP TERLUAS (PASAL 3.2)
    // ----------------------------------------------------
    const canvasAtap = document.getElementById('chartAtapTerluas');
    if (canvasAtap && typeof Chart !== 'undefined') {
        const ctxAtap = canvasAtap.getContext('2d');

        const colorRedSolid = '#EA4335';
        const colorBlueSolid = '#4285F4';
        const colorYellowSolid = '#FBBC05';

        const colorRedFaded = 'rgba(234, 67, 53, 0.25)';
        const colorBlueFaded = 'rgba(66, 133, 244, 0.25)';
        const colorYellowFaded = 'rgba(251, 188, 5, 0.25)';

        const baseColors = [colorRedSolid, colorBlueSolid, colorYellowSolid];
        const fadedColors = [colorRedFaded, colorBlueFaded, colorYellowFaded];

        new Chart(ctxAtap, {
            type: 'pie',
            data: {
                labels: ['Seng/Spandek', 'Beton', 'Tinggal di bawah kolom'],
                datasets: [{
                    data: [143, 1, 1],
                    backgroundColor: [...baseColors],
                    borderColor: '#ffffff',
                    borderWidth: 2,
                    hoverOffset: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: {
                    animateRotate: true,
                    animateScale: true,
                    duration: 1000
                },
                onHover: (event, chartElement, chart) => {
                    if (chartElement.length > 0) {
                        const activeIndex = chartElement[0].index;
                        const dataset = chart.data.datasets[0];

                        dataset.backgroundColor = dataset.data.map((_, index) => {
                            return index === activeIndex ? baseColors[index] : fadedColors[index];
                        });
                    } else {
                        chart.data.datasets[0].backgroundColor = [...baseColors];
                    }
                    chart.update('none');
                },
                plugins: {
                    legend: {
                        position: 'right',
                        labels: {
                            font: {
                                family: 'Plus Jakarta Sans',
                                size: 12,
                                weight: '500'
                            },
                            usePointStyle: true,
                            boxWidth: 10,
                            padding: 15
                        }
                    },
                    tooltip: {
                        backgroundColor: '#1f2937',
                        padding: 10,
                        titleFont: {
                            family: 'Plus Jakarta Sans',
                            size: 13,
                            weight: 'bold'
                        },
                        bodyFont: {
                            family: 'Plus Jakarta Sans',
                            size: 12
                        },
                        callbacks: {
                            label: function (context) {
                                const label = context.label || '';
                                const value = context.raw || 0;
                                const percentages = [98.6, 0.7, 0.7];
                                return `${label}: ${value} KK (${percentages[context.dataIndex]}%)`;
                            }
                        }
                    }
                }
            }
        });
    }

    // ----------------------------------------------------
    // 4.1 DIAGRAM KELAYAKAN HUNIAN (PASAL 4.1)
    // ----------------------------------------------------
    const canvasKelayakan = document.getElementById('chartKelayakanHunian');
    if (canvasKelayakan && typeof Chart !== 'undefined') {
        const ctxKelayakan = canvasKelayakan.getContext('2d');

        const colorBlueSolid = '#4285F4'; // Layak
        const colorRedSolid = '#EA4335';  // Tidak Layak

        const colorBlueFaded = 'rgba(66, 133, 244, 0.25)';
        const colorRedFaded = 'rgba(234, 67, 53, 0.25)';

        const baseKelayakanColors = [colorBlueSolid, colorRedSolid];
        const fadedKelayakanColors = [colorBlueFaded, colorRedFaded];

        const chartKelayakan = new Chart(ctxKelayakan, {
            type: 'pie',
            data: {
                labels: ['Layak Huni', 'Tidak Layak Huni'],
                datasets: [{
                    data: [130, 15],
                    backgroundColor: [...baseKelayakanColors],
                    borderColor: '#ffffff',
                    borderWidth: 2,
                    hoverOffset: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: {
                    animateRotate: true,
                    animateScale: true,
                    duration: 1000
                },
                onHover: (event, chartElement, chart) => {
                    const dataset = chart.data.datasets[0];
                    if (chartElement.length > 0) {
                        const activeIndex = chartElement[0].index;
                        dataset.backgroundColor = baseKelayakanColors.map((color, index) => {
                            return index === activeIndex ? color : fadedKelayakanColors[index];
                        });
                    } else {
                        dataset.backgroundColor = [...baseKelayakanColors];
                    }
                    chart.draw();
                },
                plugins: {
                    legend: {
                        position: 'right',
                        labels: {
                            font: {
                                family: 'Plus Jakarta Sans',
                                size: 12,
                                weight: '500'
                            },
                            usePointStyle: true,
                            boxWidth: 10,
                            padding: 15
                        }
                    },
                    tooltip: {
                        backgroundColor: '#1f2937',
                        padding: 10,
                        titleFont: {
                            family: 'Plus Jakarta Sans',
                            size: 13,
                            weight: 'bold'
                        },
                        bodyFont: {
                            family: 'Plus Jakarta Sans',
                            size: 12
                        },
                        callbacks: {
                            label: function (context) {
                                const label = context.label || '';
                                const value = context.raw || 0;
                                const total = 145;
                                const percentage = ((value / total) * 100).toFixed(1);
                                return `${label}: ${value} KK (${percentage}%)`;
                            }
                        }
                    }
                }
            }
        });
    }

    // ----------------------------------------------------
    // 4.2 DIAGRAM SUMBER AIR MINUM (PASAL 4.2)
    // ----------------------------------------------------
    const canvasAirMinum = document.getElementById('chartAirMinum');
    if (canvasAirMinum && typeof Chart !== 'undefined') {
        const ctxAirMinum = canvasAirMinum.getContext('2d');

        const colorBlueSolid = '#4285F4';   // Lainnya
        const colorRedSolid = '#EA4335';    // PDAM
        const colorYellowSolid = '#FBBC05'; // Sumur Bor
        const colorGreenSolid = '#34A853';  // Sumur Gali

        const colorBlueFaded = 'rgba(66, 133, 244, 0.25)';
        const colorRedFaded = 'rgba(234, 67, 53, 0.25)';
        const colorYellowFaded = 'rgba(251, 188, 5, 0.25)';
        const colorGreenFaded = 'rgba(52, 168, 83, 0.25)';

        const baseAirColors = [colorBlueSolid, colorRedSolid, colorYellowSolid, colorGreenSolid];
        const fadedAirColors = [colorBlueFaded, colorRedFaded, colorYellowFaded, colorGreenFaded];

        const chartAirMinum = new Chart(ctxAirMinum, {
            type: 'pie',
            data: {
                labels: ['Lainnya', 'PDAM', 'Sumur Bor', 'Sumur Gali'],
                datasets: [{
                    data: [8, 121, 8, 8],
                    backgroundColor: [...baseAirColors],
                    borderColor: '#ffffff',
                    borderWidth: 2,
                    hoverOffset: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: {
                    animateRotate: true,
                    animateScale: true,
                    duration: 1000
                },
                onHover: (event, chartElement, chart) => {
                    const dataset = chart.data.datasets[0];
                    if (chartElement.length > 0) {
                        const activeIndex = chartElement[0].index;
                        dataset.backgroundColor = baseAirColors.map((color, index) => {
                            return index === activeIndex ? color : fadedAirColors[index];
                        });
                    } else {
                        dataset.backgroundColor = [...baseAirColors];
                    }
                    chart.draw();
                },
                plugins: {
                    legend: {
                        position: 'right',
                        labels: {
                            font: {
                                family: 'Plus Jakarta Sans',
                                size: 12,
                                weight: '500'
                            },
                            usePointStyle: true,
                            boxWidth: 10,
                            padding: 15
                        }
                    },
                    tooltip: {
                        backgroundColor: '#1f2937',
                        padding: 10,
                        titleFont: {
                            family: 'Plus Jakarta Sans',
                            size: 13,
                            weight: 'bold'
                        },
                        bodyFont: {
                            family: 'Plus Jakarta Sans',
                            size: 12
                        },
                        callbacks: {
                            label: function (context) {
                                const label = context.label || '';
                                const value = context.raw || 0;
                                const percentages = [5.5, 83.4, 5.5, 5.5];
                                return `${label}: ${value} KK (${percentages[context.dataIndex]}%)`;
                            }
                        }
                    }
                }
            }
        });
    }

    // ----------------------------------------------------
    // 5. DIAGRAM KONDISI SANITASI (PASAL 4.1 - BAB IV)
    // ----------------------------------------------------
    const canvasSanitasi = document.getElementById('chartSanitasi');
    if (canvasSanitasi && typeof Chart !== 'undefined') {
        const ctxSanitasi = canvasSanitasi.getContext('2d');

        const colorBlueSolid = '#4285F4'; // Layak
        const colorRedSolid = '#EA4335';  // Tidak Layak

        const colorBlueFaded = 'rgba(66, 133, 244, 0.25)';
        const colorRedFaded = 'rgba(234, 67, 53, 0.25)';

        const baseSanitasiColors = [colorBlueSolid, colorRedSolid];
        const fadedSanitasiColors = [colorBlueFaded, colorRedFaded];

        new Chart(ctxSanitasi, {
            type: 'pie',
            data: {
                labels: ['Layak', 'Tidak Layak'],
                datasets: [{
                    data: [137, 8],
                    backgroundColor: [...baseSanitasiColors],
                    borderColor: '#ffffff',
                    borderWidth: 2,
                    hoverOffset: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: {
                    animateRotate: true,
                    animateScale: true,
                    duration: 1000
                },
                onHover: (event, chartElement, chart) => {
                    if (chartElement.length > 0) {
                        const activeIndex = chartElement[0].index;
                        const dataset = chart.data.datasets[0];

                        dataset.backgroundColor = dataset.data.map((_, index) => {
                            return index === activeIndex ? baseSanitasiColors[index] : fadedSanitasiColors[index];
                        });
                    } else {
                        chart.data.datasets[0].backgroundColor = [...baseSanitasiColors];
                    }
                    chart.update('none');
                },
                plugins: {
                    legend: {
                        position: 'right',
                        labels: {
                            font: {
                                family: 'Plus Jakarta Sans',
                                size: 12,
                                weight: '500'
                            },
                            usePointStyle: true,
                            boxWidth: 10,
                            padding: 15
                        }
                    },
                    tooltip: {
                        backgroundColor: '#1f2937',
                        padding: 10,
                        titleFont: {
                            family: 'Plus Jakarta Sans',
                            size: 13,
                            weight: 'bold'
                        },
                        bodyFont: {
                            family: 'Plus Jakarta Sans',
                            size: 12
                        },
                        callbacks: {
                            label: function (context) {
                                const label = context.label || '';
                                const value = context.raw || 0;
                                const percentages = [94.5, 5.5];
                                return `${label}: ${value} KK (${percentages[context.dataIndex]}%)`;
                            }
                        }
                    }
                }
            }
        });
    }

    // ----------------------------------------------------
    // 6. DIAGRAM PEKERJAAN KEPALA KELUARGA (BAB V - KEPALA KELUARGA)
    // ----------------------------------------------------
    const canvasPekerjaan = document.getElementById('chartPekerjaanKK');
    if (canvasPekerjaan && typeof Chart !== 'undefined') {
        const ctxPekerjaan = canvasPekerjaan.getContext('2d');

        const colorBlueSolid = '#4285F4';
        const colorBlueFaded = 'rgba(66, 133, 244, 0.25)';

        new Chart(ctxPekerjaan, {
            type: 'bar',
            data: {
                labels: [
                    'Petani/Pekebun', 
                    'Mengurus Rumah Tangga', 
                    'Buruh Harian Lepas', 
                    'TIDAK ADA', 
                    'SWASTA', 
                    'Tukang Kayu', 
                    'Buruh Tani', 
                    'SOPIR', 
                    'MEKANIK', 
                    'Tukang Batu', 
                    'Kuli Bangunan', 
                    'Meninggal, tinggal anaknya RAHMAT YANI', 
                    'Buruh Bangunan', 
                    'MENJUAL SAYUR DI PASAR'
                ],
                datasets: [{
                    label: 'Jumlah (KK)',
                    data: [46, 39, 38, 8, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1],
                    backgroundColor: colorBlueSolid,
                    borderColor: colorBlueSolid,
                    borderWidth: 1,
                    borderRadius: 4,
                    barPercentage: 0.7
                }]
            },
            options: {
                indexAxis: 'y', // Membuat diagram batang menjadi horizontal
                responsive: true,
                maintainAspectRatio: false,
                animation: {
                    duration: 1000,
                    easing: 'easeOutQuart'
                },
                onHover: (event, chartElement, chart) => {
                    if (chartElement.length > 0) {
                        const activeIndex = chartElement[0].index;
                        const dataset = chart.data.datasets[0];

                        dataset.backgroundColor = dataset.data.map((_, index) => {
                            return index === activeIndex ? colorBlueSolid : colorBlueFaded;
                        });
                    } else {
                        chart.data.datasets[0].backgroundColor = colorBlueSolid;
                    }
                    chart.update('none');
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: '#1f2937',
                        padding: 10,
                        titleFont: {
                            family: 'Plus Jakarta Sans',
                            size: 13,
                            weight: 'bold'
                        },
                        bodyFont: {
                            family: 'Plus Jakarta Sans',
                            size: 12
                        },
                        callbacks: {
                            label: function (context) {
                                const value = context.raw || 0;
                                const total = 145;
                                const percentages = [31.7, 26.9, 26.2, 5.5, 1.4, 1.4, 1.4, 1.4, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7];
                                const percentage = percentages[context.dataIndex];
                                return `Jumlah: ${value} KK (${percentage}%)`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        beginAtZero: true,
                        max: 50,
                        ticks: {
                            stepSize: 10,
                            font: {
                                family: 'Plus Jakarta Sans',
                                size: 12
                            }
                        },
                        title: {
                            display: true,
                            text: 'Jumlah (KK)',
                            color: '#1f2937',
                            font: {
                                family: 'Plus Jakarta Sans',
                                size: 12,
                                weight: '600'
                            }
                        },
                        grid: {
                            color: '#e5e7eb'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Kategori',
                            color: '#1f2937',
                            font: {
                                family: 'Plus Jakarta Sans',
                                size: 12,
                                weight: '600'
                            }
                        },
                        ticks: {
                            font: {
                                family: 'Plus Jakarta Sans',
                                size: 11
                            }
                        },
                        grid: {
                            display: false
                        }
                    }
                }
            }
        });
    }
});