FROM mcr.microsoft.com/dotnet/core/aspnet:3.1.1-alpine AS runtime
WORKDIR /app
COPY publish_output ./
ENTRYPOINT ["dotnet", "ListingApi.dll"]
EXPOSE 3000