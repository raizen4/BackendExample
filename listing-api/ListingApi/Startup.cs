using System;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using ListingApi.Clients;
using ListingApi.Configuration;
using ListingApi.DataAccess;
using ListingApi.Helpers;
using ListingApi.Interfaces.Clients;
using ListingApi.Interfaces.Helpers;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.IdentityModel.Logging;
using Microsoft.OpenApi.Models;
using Newtonsoft.Json.Serialization;
using Polly;
using Prometheus;
using Boomin.Platform.CosmosDatabase;
using ListingApi.Services;
using Microsoft.AspNetCore.Http;
using ListingApi.Interfaces.DataAccess;

namespace ListingApi
{
    public class Startup
    {

        public IConfiguration Configuration { get; }

        private IWebHostEnvironment _env { get; }

        private const string CorsPolicyName = "LaunchBCors";

        public Startup(IConfiguration configuration, IWebHostEnvironment env)
        {
            Configuration = configuration;
            _env = env;
        }

        public void ConfigureServices(IServiceCollection services)
        {
            IdentityModelEventSource.ShowPII = true;

            services.AddPlatformDocumentDatabase(Configuration, DataAccessConfig.ListingContainerName, _env.IsDevelopment());
            services.AddPlatformDocumentDatabase(Configuration, DataAccessConfig.ListingAuditContainerName, _env.IsDevelopment());

            services.AddAuthentication(
                    options =>
                    {
                        options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
                    })
                .AddJwtBearer("B2C", jwtOptions =>
                {
                    jwtOptions.Authority =
                        $"{Configuration["Shared:AgentAzureAdB2C:Tenant"]}/{Configuration["Shared:AgentAzureAdB2C:Policy"]}/v2.0/";
                    jwtOptions.Audience = Configuration["AzureAdB2C:ClientId"];
                    jwtOptions.Events = new JwtBearerEvents
                    {
                        OnChallenge = (ct) =>
                        {
                            return Task.CompletedTask;
                        },
                        OnTokenValidated = (ct) =>
                        {
                            return Task.CompletedTask;
                        },
                        OnAuthenticationFailed = (ctx) =>
                        {
                            return Task.CompletedTask;
                        }
                    };
                });
            services.AddAuthorization(options =>
            {
                var b2cPolicy = new AuthorizationPolicyBuilder().RequireAuthenticatedUser()
                    .AddAuthenticationSchemes("B2C").Build();
                options.AddPolicy(JwtBearerDefaults.AuthenticationScheme, b2cPolicy);
                options.DefaultPolicy = b2cPolicy;
            });

            var corsServices = Configuration.GetSection("CORS:AllowedEndpoints").GetChildren().Select(s => s.Value)
                .ToArray();

            services.AddCors(options =>
            {
                options.AddPolicy(CorsPolicyName,
                    builder =>
                    {
                        builder.WithOrigins(corsServices)
                            .AllowAnyHeader()
                            .AllowAnyMethod();
                    });
            });

            services.AddTransient<HttpClient>();

            services.AddSingleton<IListingStore, ListingStoreAccess>();
            services.AddSingleton<IAuditListingStore, AuditListingStoreAccess>();
            services.AddSingleton<IListingHelperService, ListingHelperService>();
            services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();
            services.AddSingleton<AgentPropertyConfiguration>();
            services.AddSingleton<ListingApiConfiguration>();
            services.AddSingleton<IAgentPropertyClient, AgentPropertyClient>();
            services.AddSingleton<Mapper>();
            services.AddSingleton<IAgentPropertyHelper, AgentPropertyHelper>();
            services.AddSingleton<IListingSyncHelper, ListingSyncHelper>();

            var config = new AgentPropertyConfiguration(Configuration);
            RegisterHttpClients(services, config);
            services.AddControllers().AddNewtonsoftJson(options =>
            {
                options.SerializerSettings.ContractResolver = new NullStringsAsEmptyContractResolver
                {
                    NamingStrategy = new CamelCaseNamingStrategy()
                };
                options.SerializerSettings.Converters.Add(new Newtonsoft.Json.Converters.StringEnumConverter());
            });

            services.AddSwaggerGen(s =>
            {
                s.SwaggerDoc("v1", new OpenApiInfo { Title = "ListingApi", Version = "v1" });
            });
        }

        public static void Configure(IApplicationBuilder app, IHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseSwagger();
            app.UseSwaggerUI(s =>
            {
                s.SwaggerEndpoint("./v1/swagger.json", "ListingApi V1");
            });

            app.UseCors(CorsPolicyName);
            app.UseRouting();
            app.UseHttpMetrics();
            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
                endpoints.MapMetrics();
            });
        }

        private static void RegisterHttpClients(IServiceCollection services, AgentPropertyConfiguration properties)
        {
            const int retryPauseMs = 500;
            const int retryCount = 3;
            services.AddHttpClient("AgentPropertyApi", client => { client.BaseAddress = properties.BaseUrl; })
                .AddTransientHttpErrorPolicy(p =>
                    p.WaitAndRetryAsync(retryCount, _ => TimeSpan.FromMilliseconds(retryPauseMs)));
        }
    }
}
