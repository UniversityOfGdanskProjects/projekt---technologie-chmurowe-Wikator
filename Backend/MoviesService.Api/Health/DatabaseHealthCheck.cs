using Microsoft.Extensions.Diagnostics.HealthChecks;
using Neo4j.Driver;

namespace MoviesService.Api.Health;

public class DatabaseHealthCheck(IDriver driver) : IHealthCheck
{
    public async Task<HealthCheckResult> CheckHealthAsync(HealthCheckContext context,
        CancellationToken cancellationToken = new())
    {
        try
        {
            await using var session = driver.AsyncSession();
            await session.RunAsync("RETURN 1");
            return HealthCheckResult.Healthy();
        }
        catch (Exception e)
        {
            return HealthCheckResult.Unhealthy("Database check failed", e);
        }
    }
}