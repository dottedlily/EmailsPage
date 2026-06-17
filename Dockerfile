FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build

ARG BUILD_CONFIGURATION=Release

WORKDIR /src

COPY ["Emailspage.csproj", "./"]
RUN dotnet restore "Emailspage.csproj"

COPY . .

RUN dotnet publish "Emailspage.csproj" \
    -c $BUILD_CONFIGURATION \
    -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final

WORKDIR /app

COPY --from=build /app/publish .

EXPOSE 8080

ENTRYPOINT ["dotnet", "Emailspage.dll"]