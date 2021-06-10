using System.Collections.Generic;

namespace API.Helpers
{
    public class PagingResponse<T>
    {
        public int Draw
        {
            get;
            set;
        }
        public int RecordsFiltered
        {
            get;
            set;
        }
        public int RecordsTotal
        {
            get;
            set;
        }
        public List<T> Data
        {
            get;
            set;
        }
    }
}