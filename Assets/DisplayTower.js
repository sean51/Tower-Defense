#pragma strict

public var normal : Material;
public var tranny : Material;
private var original : boolean;

public var cost : int = 5;

function Start () 
{
	gameObject.GetComponent.<Renderer>().material = tranny;
}

function Update () 
{
	if(findTowers())
	{
		original = false;
		gameObject.GetComponent.<Renderer>().material = tranny;
	}
	else
	{
		original = true;
		gameObject.GetComponent.<Renderer>().material = normal;
	}
}

function findTowers() : boolean
{
	var hitColliders = Physics.OverlapSphere(gameObject.transform.position, .25);
	for (var i = 0; i < hitColliders.Length; i++) 
	{
		if(hitColliders[i].gameObject.tag == "Tower")
		{
			return true;
		}
	}
		return false;
}

function isPlaceable() : boolean
{
	if(original && Level.GOLD > cost)
	{
		Level.GOLD -= cost;
		return true;
	}
	return false;
}