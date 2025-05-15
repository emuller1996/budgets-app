import { Router } from "express";
import { client } from "../db.js";

const DashboardRouters = Router();

DashboardRouters.get("/sales", async (req, res) => {
  
  const currentDate = Date.now();

  // Timestamp de hace 30 días (restamos 30 días en milisegundos)
  const thirtyDaysAgo = currentDate - 30 * 24 * 60 * 60 * 1000;

  try {
    const result = await client.search({
      index: "eventosmull",
      body: {
        size: 1,
        query: {
          bool: {
            must: [
              {
                term: {
                  "type.keyword": {
                    value: "orden",
                  },
                },
              },
              {
                range: {
                  createdTime: {
                    gte: thirtyDaysAgo,
                    lte: currentDate,
                  },
                },
              },
            ],
          },
        },
        aggs: {
          last30days: {
            date_histogram: {
              field: "createdTime",
              calendar_interval: "day",
            },
            aggs: {
              suma: {
                sum: {
                  field: "total_order",
                },
              },
            },
          },
        },
      },
    });

    return res.status(200).json(result.body.aggregations.last30days.buckets);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

export default DashboardRouters;
