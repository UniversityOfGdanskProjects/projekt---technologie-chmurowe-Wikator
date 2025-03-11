# Use the ASP.NET Core runtime as the base image
FROM mcr.microsoft.com/dotnet/aspnet:8.0-alpine AS base
WORKDIR /app

# Use the ASP.NET Core SDK as the build environment
FROM mcr.microsoft.com/dotnet/sdk:8.0-alpine AS build
WORKDIR /src
COPY ["./MoviesService.Api/MoviesService.Api.csproj", "./MoviesService.Api/"]
COPY ["./MoviesService.DataAccess/MoviesService.DataAccess.csproj", "./MoviesService.DataAccess/"]
COPY ["./MoviesService.Models/MoviesService.Models.csproj", "./MoviesService.Models/"]

RUN dotnet restore "MoviesService.Api/MoviesService.Api.csproj"
COPY . .

# Build the application
RUN dotnet build "MoviesService.Api/MoviesService.Api.csproj" -c Release -o /app/build

# Publish the application
FROM build AS publish
RUN dotnet publish "MoviesService.Api/MoviesService.Api.csproj" -c Release -o /app/publish

# Final stage: create the runtime image
FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "MoviesService.Api.dll"]