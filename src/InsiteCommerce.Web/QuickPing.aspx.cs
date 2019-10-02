using System;
using System.Threading.Tasks;
using System.Web.UI;
using Insite.Common.Dependencies;
using Insite.Core.HealthCheck;

public partial class QuickPing : Page
{
    public HealthCheckResults HealthCheckResults;

    protected void Page_Load(object sender, EventArgs e)
    {
        this.RegisterAsyncTask(new PageAsyncTask(this.GetHealthCheckAsync));
    }

    private async Task GetHealthCheckAsync()
    {
        var healthCheckManager = DependencyLocator.Current.GetInstance<IHealthCheckManager>();
        this.HealthCheckResults = await healthCheckManager.CheckHealth();
    }
}