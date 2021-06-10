using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.Hosting;
using System.IO;
using System.Text;
using System;

public class CustomExceptionFilter : IExceptionFilter
{
    private readonly IWebHostEnvironment _env;

    public CustomExceptionFilter(IWebHostEnvironment env)
    {
        this._env = env;

    }

    public void OnException(ExceptionContext context)
    {
        AddToLog(context.Exception, Path.Combine(_env.ContentRootPath, "wwwroot","LogErrors", "Error.txt"));
    }

    public static void AddToLog(Exception exception, string path)
    {
        StringBuilder sb = new StringBuilder();
        sb.AppendLine(DateTime.Now.ToLocalTime().ToString("F"));
        GetExceptionInfo(exception, sb);
        sb.AppendLine("------------------------------------------------------------" + Environment.NewLine);
        File.AppendAllText(path, sb.ToString());
    }

    private static void GetExceptionInfo(Exception exception, StringBuilder sb)
    {
        sb.AppendLine(exception.GetType().ToString());
        sb.AppendLine(exception.Message);
        sb.AppendLine("Stack Trace: ");
        sb.AppendLine(exception.StackTrace);
       
        if (exception.InnerException != null)
        {
            sb.AppendLine("InnerException: ");
            GetExceptionInfo(exception.InnerException, sb);
        }
    }
}