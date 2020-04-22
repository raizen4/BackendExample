using System;
using System.IO;
using Azure.Identity;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Azure.KeyVault;
using Microsoft.Azure.Services.AppAuthentication;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace ListingApi
{
    public class Program
    {
        public static void Main(string[] args)
        {
            CreateHostBuilder(args).Build().Run();
        }

        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    webBuilder.UseUrls("http://0.0.0.0:3002");
                    webBuilder.UseStartup<Startup>();

                    webBuilder.ConfigureLogging(loggingBuilder =>
                    {
                        loggingBuilder.ClearProviders();
                        loggingBuilder.AddConsole();
                    });

                    SetupAppSettings(webBuilder);
                });

        private static void SetupAppSettings(IWebHostBuilder webBuilder)
        {
            webBuilder.ConfigureAppConfiguration((hostingContext, config) =>
            {
                if (hostingContext.HostingEnvironment.IsDevelopment())
                {
                    var projectDir = Directory.GetCurrentDirectory();
                    var configPath = Path.Combine(projectDir, "appsettings.json");
                    config.AddJsonFile(configPath, optional: false, reloadOnChange: false);
                }
                else
                {
                    var envVariables = config.AddEnvironmentVariables().Build();
                    var endpoint = new Uri(envVariables["APP_CONFIGURATION_URL"]);
                    var azureServiceTokenProvider = new AzureServiceTokenProvider();
                    var kvClient = new KeyVaultClient(new KeyVaultClient.AuthenticationCallback(azureServiceTokenProvider.KeyVaultTokenCallback));

                    config.AddAzureAppConfiguration(options =>
                    {
                        options.Connect(endpoint, new ManagedIdentityCredential())
                            .UseAzureKeyVault(kvClient)
                            .Select($"{envVariables["APP_CONFIGURATION_DOMAIN"]}:{envVariables["APP_CONFIGURATION_NAME"]}:*", envVariables["APP_CONFIGURATION_ENVIRONMENT"])
                            .Select("Shared:*", envVariables["APP_CONFIGURATION_ENVIRONMENT"]);

                        options.TrimKeyPrefix($"{envVariables["APP_CONFIGURATION_DOMAIN"]}:{envVariables["APP_CONFIGURATION_NAME"]}:");
                    });
                }
            });
        }
    }
}
