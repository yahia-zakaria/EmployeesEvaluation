using Dapper;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using Npgsql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using System.Linq;

namespace API.DAL
{
    public class DapperOrm : IDapper
    {
        private readonly IConfiguration _config;
        //private readonly string _connectionstring = "DefaultConnection";

        public DapperOrm(IConfiguration config)
        {
            _config = config;
        }
        public void Dispose()
        {

        }

        public int Execute(string sp, DynamicParameters parms, CommandType commandType = CommandType.StoredProcedure)
        {
            throw new NotImplementedException();
        }

        public T Get<T>(string sp, DynamicParameters parms, CommandType commandType = CommandType.Text)
        {
            using IDbConnection db = new NpgsqlConnection(GetConnectionString());
            return db.Query<T>(sp, parms, commandType: commandType).FirstOrDefault();
        }

        public List<T> GetAll<T>(string sp, DynamicParameters parms, CommandType commandType = CommandType.StoredProcedure)
        {
            using IDbConnection db = new NpgsqlConnection(GetConnectionString());
            return db.Query<T>(sp, parms, commandType: commandType).ToList();
        }

        // public DbConnection GetDbconnection()
        // {
        //     return new NpgsqlConnection(_config.GetConnectionString(_connectionstring));
        // }

        // public T Insert<T>(string sp, DynamicParameters parms, CommandType commandType = CommandType.StoredProcedure)
        // {
        //     T result;
        //     using IDbConnection db = new NpgsqlConnection(_config.GetConnectionString(_connectionstring));
        //     try
        //     {
        //         if (db.State == ConnectionState.Closed)
        //             db.Open();

        //         using var tran = db.BeginTransaction();
        //         try
        //         {
        //             result = db.Query<T>(sp, parms, commandType: commandType, transaction: tran).FirstOrDefault();
        //             tran.Commit();
        //         }
        //         catch (Exception ex)
        //         {
        //             tran.Rollback();
        //             throw ex;
        //         }
        //     }
        //     catch (Exception ex)
        //     {
        //         throw ex;
        //     }
        //     finally
        //     {
        //         if (db.State == ConnectionState.Open)
        //             db.Close();
        //     }

        //     return result;
        // }

        // public T Update<T>(string sp, DynamicParameters parms, CommandType commandType = CommandType.StoredProcedure)
        // {
        //     T result;
        //     using IDbConnection db = new NpgsqlConnection(_config.GetConnectionString(_connectionstring));
        //     try
        //     {
        //         if (db.State == ConnectionState.Closed)
        //             db.Open();

        //         using var tran = db.BeginTransaction();
        //         try
        //         {
        //             result = db.Query<T>(sp, parms, commandType: commandType, transaction: tran).FirstOrDefault();
        //             tran.Commit();
        //         }
        //         catch (Exception ex)
        //         {
        //             tran.Rollback();
        //             throw ex;
        //         }
        //     }
        //     catch (Exception ex)
        //     {
        //         throw ex;
        //     }
        //     finally
        //     {
        //         if (db.State == ConnectionState.Open)
        //             db.Close();
        //     }

        //     return result;
        // }

        private string GetConnectionString()
        {
            var connUrl = Environment.GetEnvironmentVariable("DATABASE_URL");
            // Parse connection URL to connection string for Npgsql
            connUrl = connUrl.Replace("postgres://", string.Empty);
            var pgUserPass = connUrl.Split("@")[0];
            var pgHostPortDb = connUrl.Split("@")[1];
            var pgHostPort = pgHostPortDb.Split("/")[0];
            var pgDb = pgHostPortDb.Split("/")[1];
            var pgUser = pgUserPass.Split(":")[0];
            var pgPass = pgUserPass.Split(":")[1];
            var pgHost = pgHostPort.Split(":")[0];
            var pgPort = pgHostPort.Split(":")[1];

            return $"Server={pgHost};Port={pgPort};User Id={pgUser};Password={pgPass};Database={pgDb};SSL Mode=Require;TrustServerCertificate=True";
        }
    }
}