using System;
using System.Globalization;
using Microsoft.AspNetCore.Mvc;

namespace ListingApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class HeartbeatController : ControllerBase
    {
        [HttpGet]
        public ActionResult<string> Get()
        {
            var currentDate = DateTime.UtcNow.ToString("yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            return Ok(currentDate);
        }
    }
}
