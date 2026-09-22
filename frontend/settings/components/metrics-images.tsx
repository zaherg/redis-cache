export const MetricsEmtpy = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="320"
        height="180"
        viewBox="0 0 320 180"
        fill="none"
        stroke="currentColor"
        stroke-width="3"
        stroke-linecap="round"
        stroke-linejoin="round"
        role="img"
        aria-label="No metrics yet"
    >
        <desc>An empty chart with a small clock. No measurements are plotted.</desc>
        <g className="metrics-empty__chart">
            <path d="M91 52C90 77 92 105 91 129C117 130 149 128 175 129" />
            <path d="M91 69H97M91 94H97M114 129V123M143 129V123" />
            <path d="M116 87H123M139 87H146M162 87H169" stroke-dasharray="1 6" />
        </g>
        <g className="metrics-empty__clock">
            <path d="M229 111C230 124 221 134 208 135C195 136 184 126 184 113C183 100 193 90 206 90C219 89 229 98 229 111Z" />
            <path d="M207 99V112L215 117" />
            <circle cx="207" cy="112" r="2" fill="currentColor" stroke="none" />
        </g>
    </svg>
);

export const MetricsSkeleton = () => (
    <div className="metrics-card__skeleton" aria-hidden="true">
        <div className="metrics-card__skeleton-labels">
            <span />
            <span />
            <span />
            <span />
        </div>
        <div className="metrics-card__skeleton-plot">
            <span />
            <span />
            <span />
            <span />
        </div>
        <div className="metrics-card__skeleton-ticks">
            <span />
            <span />
            <span />
            <span />
        </div>
    </div>
);

export const MetricsInactive = () => (
    <svg
        className="metrics-card__symbol"
        xmlns="http://www.w3.org/2000/svg"
        width="80"
        height="80"
        viewBox="0 0 80 80"
        fill="currentColor"
        aria-hidden="true"
        focusable="false"
    >
        <path d="M9 9V67A2 2 0 0 0 11 69H73" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
        <rect x="21" y="35" width="11" height="24" rx="2" />
        <rect x="40" y="20" width="11" height="39" rx="2" />
        <rect x="59" y="7" width="11" height="52" rx="2" />
    </svg>
);
