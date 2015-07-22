using UnityEngine;
using System.Collections;
using Pathfinding;

public class AIPathfindingBehavior : MonoBehaviour 
{
	public Transform target;

	Seeker seeker;
	Path path;
	int currentWaypoint;

	float speed = 2;
	float maxWaypointDistance = 1f;
	CharacterController characterController;
	void Start () 
	{
		seeker = GetComponent<Seeker>();
		characterController = GetComponent<CharacterController> ();
	}
	
	// Update is called once per frame
	public void OnPathComplete(Path p)
	{
		if (!p.error) 
		{
			path = p;
			currentWaypoint = 0;
		} 
		else 
		{
			Debug.Log (p.error);
		}
	}

	void Update()
	{
		if (path == null) 
		{
			return;
		}
		if (currentWaypoint >= path.vectorPath.Count) 
		{
			return;
		}
		Vector3 dir = (path.vectorPath[currentWaypoint]-transform.position).normalized * speed;
		characterController.SimpleMove(dir);
		if (Vector3.Distance (transform.position, path.vectorPath[currentWaypoint]) < maxWaypointDistance) 
		{
			currentWaypoint++;
		}
	}

	void setTarget(Transform newTarget)
	{
		target = newTarget;
		seeker = GetComponent<Seeker>();
		seeker.StartPath (transform.position, target.position, OnPathComplete);
	}
}
