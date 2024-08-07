﻿using MoviesService.Api.Services;
using MoviesService.Api.Services.Contracts;
using MoviesService.DataAccess;
using MoviesService.DataAccess.Contracts;
using MoviesService.DataAccess.Repositories;
using MoviesService.DataAccess.Repositories.Contracts;
using Neo4j.Driver;

namespace MoviesService.Api.Extensions;

public static class ApplicationServiceExtensions
{
    public static void AddApplicationServices(this IServiceCollection services)
    {
        services.AddScoped<IPhotoService, PhotoService>();
        services.AddScoped<ITokenService, TokenService>();
        services.AddSingleton<IMqttService, MqttService>();
        services.AddScoped<IUserClaimsProvider, UserClaimsProvider>();
        services.AddScoped<IResponseHandler, ResponseHandler>();
    }
    
    public static void AddDataAccessRepositories(this IServiceCollection services, IConfiguration config)
    {
        var server = config["Db_Server"]
                     ?? throw new Exception("Db_Server not found");

        var userName = config["Db_UserName"]
                       ?? throw new Exception("Db_UserName not found");

        var password = config["Db_Password"]
                       ?? throw new Exception("Db_Password string not found");
        
        services.AddSingleton(GraphDatabase.Driver(server, AuthTokens.Basic(userName, password)));
        services.AddSingleton<IAsyncQueryExecutor, AsyncQueryExecutor>();
        
        services.AddScoped<IMovieRepository, MovieRepository>();
        services.AddScoped<IActorRepository, ActorRepository>();
        services.AddScoped<IAccountRepository, AccountRepository>();
        services.AddScoped<IUserRepository, UserRepository>();
        services.AddScoped<INotificationRepository, NotificationRepository>();
        services.AddScoped<IReviewRepository, ReviewRepository>();
        services.AddScoped<IWatchlistRepository, WatchlistRepository>();
        services.AddScoped<IFavouriteRepository, FavouriteRepository>();
        services.AddScoped<IIgnoresRepository, IgnoresRepository>();
        services.AddScoped<ICommentRepository, CommentRepository>();
        services.AddScoped<IGenreRepository, GenreRepository>();
        services.AddSingleton<IMessageRepository, MessageRepository>();
    }
}