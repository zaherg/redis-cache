import { Metrics } from '@redis-cache/settings/components/metrics';
import { ObjectCachePro } from '@redis-cache/settings/components/object-cache-pro';

export const Dashboard = () => (
    <>
        <h1>Redis Object Cache</h1>
        <div className="columns">
            <div className="content-column">
                <section className="metrics">
                    <Metrics />
                </section>
            </div>
            <div className="sidebar-column">
                <ObjectCachePro />
            </div>
        </div>
    </>
);
