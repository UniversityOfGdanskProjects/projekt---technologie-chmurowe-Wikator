﻿using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.Extensions.Options;
using MoviesService.Api.Services.Contracts;

namespace MoviesService.Api.Services;

public class PhotoService(IConfiguration config) : IPhotoService
{
    private Cloudinary Cloudinary { get; } = new(new Account(
        config["CloudinarySettings_CloudName"],
        config["CloudinarySettings_ApiKey"],
        config["CloudinarySettings_ApiSecret"]
    ));

    public async Task<ImageUploadResult> AddPhotoAsync(IFormFile file, string gravity = "auto")
    {
        var uploadResult = new ImageUploadResult();

        if (file.Length <= 0)
            return uploadResult;

        await using var stream = file.OpenReadStream();
        var uploadParams = new ImageUploadParams
        {
            File = new FileDescription(file.FileName, stream),
            Transformation = new Transformation()
                .Height(1080)
                .Width(720)
                .Crop("fill")
                .AspectRatio(1.33)
                .Gravity(gravity),
            Folder = "p-bz-2"
        };

        return await Cloudinary.UploadAsync(uploadParams);
    }

    public async Task<DeletionResult> DeleteAsync(string publicId)
    {
        return await Cloudinary.DestroyAsync(new DeletionParams(publicId));
    }
}